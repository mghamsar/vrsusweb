    
    var canvas = document.getElementById("canvas");
    console.log(canvas);

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    //canvas.width = 600;
    //canvas.height = 550;
    var gl = null;
    for (var i=0; i<4; i++)
    {
        gl = canvas.getContext(["webgl","experimental-webgl","moz-webgl","webkit-3d"][i])
        if (gl)
            break;
    }

    // prepare WebGL
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, "attribute vec2 vx;varying vec2 tx;void main(){gl_Position=vec4(vx.x*2.0-1.0,1.0-vx.y*2.0,0,1);tx=vx;}");
    gl.compileShader(vs);

    var ps = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(ps, "precision mediump float;uniform sampler2D sm;varying vec2 tx;void main(){gl_FragColor=texture2D(sm,tx);}");
    gl.compileShader(ps);

    var shader  = gl.createProgram();
    gl.attachShader(shader, vs);
    gl.attachShader(shader, ps);
    gl.linkProgram(shader);
    gl.useProgram(shader);

    var vx_ptr = gl.getAttribLocation(shader, "vx");
    gl.enableVertexAttribArray(vx_ptr);
    gl.uniform1i(gl.getUniformLocation(shader, "sm"), 0);

    var vx = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vx);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 1,1, 0,1]), gl.STATIC_DRAW);

    var ix = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ix);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2, 0,2,3]), gl.STATIC_DRAW);

    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);-
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    //console.log("GL OBJEEEEEEEEECT" + gl);
    // load the video
    /*var video = document.createElement("video");
    video.muted = true;
    var videoready = false;
    video.autoplay = false;
    video.loop = true;
    video.crossOrigin = "anonymous";
    video.oncanplay = function(){ videoready=true; }
    video.width = 620;
    video.height = 375;
    video.width = nextPowerOf2(500);
    video.height = nextPowerOf2(375);
    video.addEventListener("play", function() {
        frameloop();
    });

    video.src = "../../media/video/sample.mp4"
    video.play();*/

    function nextPowerOf2(x) {
        return Math.pow(2, Math.ceil(Math.log(x) / Math.log(2)));
    }

    var needtouch = false;
    function video_touch_start()
    {
        window.removeEventListener("touchstart", video_touch_start, true);
        video.play();
        needtouch = false;
    }

    // requestAnimationFrame loop
    function frameloop()
    {
        if (video && video.paused)
        {
            if (needtouch == false)
            {
                needtouch = true;
                window.addEventListener("touchstart", video_touch_start, true);
            }
        }
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.activeTexture(gl.TEXTURE0);
        //gl.bindTexture(gl.TEXTURE_2D, tex);

        if (videoready)
        {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vx);
        gl.vertexAttribPointer(vx_ptr, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ix);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        window.requestAnimationFrame(frameloop);
    }