var container, stats;
      var camera, controls, scene, renderer;
      var pickingData = [], pickingTexture, pickingScene;
      var objects = [];
      var highlightBox;

      var mouse = new THREE.Vector2();
      var offset = new THREE.Vector3( 10, 10, 10 );

      var gameArray = [];
      var group = new THREE.Group();

      var cubeLength = 15,
          cubeDistance = 11,
          cubeScale = 5;

      var tick = 0,
          refreshRate = 30;

      var startingComplexity = 0.75;

      init();
      animate();

      function init() {

        container = document.getElementById( "container" );

        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.x = 240;
        camera.position.y = 210;
        camera.position.z = 230;
        camera.position._x = -0.75;
        camera.position._y = 0.65;
        camera.position._z = 0.25;

        controls = new THREE.TrackballControls( camera );
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        scene = new THREE.Scene();
        scene.add( new THREE.AmbientLight( 0x555555 ) );

        // Create the game array
        var geom = new THREE.BoxGeometry( 1, 1, 1 );
        var color = new THREE.Color();

        for ( var i = 0; i < cubeLength; i ++ ) {

          gameArray[i] = [];

          for ( var j = 0; j < cubeLength; j ++ ) {

            gameArray[i][j] = [];

            for ( var k = 0; k < cubeLength; k ++ ) {

              var tempmat = new THREE.MeshBasicMaterial({ color: 0xffffff } );

              if(Math.random() > startingComplexity){
                tempmat = new THREE.MeshBasicMaterial({ color: 0x333333 } );
                gameArray[i][j][k] = true;
              }
              else {
                gameArray[i][j][k] = false;
              }

              cube = new THREE.Mesh( geom, tempmat );
              cube.position.x = i * cubeDistance;
              cube.position.y = j * cubeDistance;
              cube.position.z = k * cubeDistance;
              cube.scale.x = cube.scale.y = cube.scale.z = cubeScale;
              cube.pos = [i,j,k];

              group.add( cube );

            }
          }
        }

        scene.add(group);

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setClearColor( 0xcccccc );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.sortObjects = false;
        container.appendChild( renderer.domElement );

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.appendChild( stats.domElement );

        renderer.domElement.addEventListener( 'mousemove', onMouseMove );

      }

      function gameTick(){
        // start 3d loop
        for ( var i = 0; i < cubeLength; i++ ) {
          for ( var j = 0; j < cubeLength; j++ ) {
            for ( var k = 0; k < cubeLength; k++ ) {

                // start 3d loop test for nearest neighbors
                var liveNeighbours = 0;
                for ( var ii = -1; ii <= 1; ii++ ) {
                  for ( var jj = -1; jj <= 1; jj++ ) {
                    for ( var kk = -1; kk <= 1; kk++ ) {
                      var newi = i + ii,
                          newj = j + jj,
                          newk = k + kk;
                      if(newi !== -1 && newj !== -1 && newk !== -1 && newi !== cubeLength && newj !== cubeLength && newk !== cubeLength){
                        if(gameArray[newi][newj][newk] /*&& ii !== 0 && jj !== 0 && kk !== 0*/){
                          liveNeighbours++;
                        }
                      }
                    }
                  }
                }
                // end 3d loop test for nearest neighbors -
                
                var truth = gameArray[i][j][k];
                var newtruth = truth;
                if(newtruth){
                  
                  // rule 1 & 3
                  if(liveNeighbours < 1 || liveNeighbours > 3){
                    newtruth = false;
                  }
                }
                else {
                  // rule 4
                  if(liveNeighbours === 3){
                    newtruth = true;
                  }
                }
                // if change -
                if(truth !== newtruth){
                  var groupPosition = (i * cubeLength * cubeLength) + (j * cubeLength) + k;
                  // set new colour
                  if(newtruth){
                    scene.children[1].children[groupPosition].material.color.setHex(0x333333);
                  }
                  else{
                    scene.children[1].children[groupPosition].material.color.setHex(0xffffff);
                  }
                  gameArray[i][j][k] = newtruth;
                }
            }
          }
        }
        // end 3d loop
      }

      function onMouseMove( e ) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }

      function animate() {
        if(tick > refreshRate){
          gameTick();
          tick = 0;
          console.log(camera.position, camera.rotation);
        }
        render();
        stats.update();
        tick++;
        requestAnimationFrame( animate );
      }

      function render() {
        controls.update();
        renderer.render( scene, camera );
      }