var container, stats;
      var camera, controls, scene, renderer;
      var pickingData = [], pickingTexture, pickingScene;
      var objects = [];
      var highlightBox;

      var mouse = new THREE.Vector2();
      var offset = new THREE.Vector3( 10, 10, 10 );

      init();
      animate();

      function init() {

        container = document.getElementById( "container" );

        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;

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

        // var light = new THREE.SpotLight( 0xffffff, 1.5 );
        // light.position.set( 0, 500, 2000 );
        // scene.add( light );

        // Create the game array

        var geometry = new THREE.Geometry(),
        defaultMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff } );

        var geom = new THREE.BoxGeometry( 1, 1, 1 );
        var color = new THREE.Color();

        var matrix = new THREE.Matrix4();
        var quaternion = new THREE.Quaternion();

        for ( var i = 0; i < 20; i ++ ) {

          for ( var j = 0; j < 20; j ++ ) {

            for ( var k = 0; k < 20; k ++ ) {

              var position = new THREE.Vector3();
              position.x = i * 200;
              position.y = j * 200;
              position.z = k * 200;

              var rotation = new THREE.Euler();
              rotation.x = Math.random() * 2 * Math.PI;
              rotation.y = Math.random() * 2 * Math.PI;
              rotation.z = Math.random() * 2 * Math.PI;

              var scale = new THREE.Vector3();
              scale.x = 10;
              scale.y = 10;
              scale.z = 10;

              quaternion.setFromEuler( rotation, false );
              matrix.compose( position, quaternion, scale );

              // give the geom's vertices a random color, to be displayed

              //applyVertexColors( geom, color.setHex( Math.random() * 0xffffff ) );

              geometry.merge( geom, matrix );

              // give the geom's vertices a color corresponding to the "id"

              //applyVertexColors( geom, color.setHex( i ) );
            }

          }

        }

        var drawnObject = new THREE.Mesh( geometry, defaultMaterial );
        scene.add( drawnObject );


        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setClearColor( 0xffffff );
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

      //

      function onMouseMove( e ) {

        mouse.x = e.clientX;
        mouse.y = e.clientY;

      }

      function animate() {

        requestAnimationFrame( animate );

        render();
        stats.update();

      }

      function render() {

        controls.update();

        renderer.render( scene, camera );

      }