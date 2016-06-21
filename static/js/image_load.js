var canvas = document.getElementById("canvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
context = canvas.getContext('2d');

var gl = null;
for (var i=0; i<4; i++)
{
    gl = canvas.getContext(["webgl","experimental-webgl","moz-webgl","webkit-3d"][i])
    if (gl)
        break;
}

var image = new Image();
image.src = "../../static/img/alibi.jpeg";

image.onload = function() {
    context.drawImage(image, 0, 0, image.width, image.height, 0,0,canvas.width, canvas.height);
}

function render(image,gl) {

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

    if ( !gl.getProgramParameter( shader, gl.LINK_STATUS) ) {
        var info = gl.getProgramInfoLog(shader);
        throw "Could not compile WebGL shader program. \n\n" + info;
    }

    // look up where the texture coordinates need to go.
    var texCoordLocation = gl.getAttribLocation(shader, "a_texCoord");

    // provide texture coordinates for the rectangle.
    /*var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);*/

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
}