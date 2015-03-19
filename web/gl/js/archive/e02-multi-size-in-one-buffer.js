/**
 * Created by francis on 2015/3/17.
 */
/////////////////////////////////
// WebGL的绘图机制称作着色器（Shader）
/////////////////////////////////

var gl;
var ANGLE_STEP = 45.0;
function main()
{
    var canvas = document.getElementById('canvas');

    initGL(canvas);
    initShaders();

    //创建顶点缓冲区
    var n = initVertexBuffers(gl);
    if(n < 0)
    {
        console.log('设置顶点位置失败！');
        return;
    }

    //设置canvas清除颜色：黑色不透明，一直有效
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var u_fragcolor = gl.getUniformLocation(gl.program, 'u_fragcolor');
    if(u_fragcolor < 0)
    {
        console.log('获取统一变量位置失败！');
        return;
    }
    gl.uniform4f(u_fragcolor, 1.0, 0.0, 0.0, 1.0);

    gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl)
{
    var vertexs = new Float32Array([
        0.0,    0.3,    10.0,
        -0.3,   -0.3,   20.0,
        0.3,    -0.3,   30.0
    ]);
    var n = 3;

    //获取属性变量位置
    var a_position = gl.getAttribLocation(gl.program, 'a_position');
    var a_pointsize = gl.getAttribLocation(gl.program, 'a_pointsize');
    if(a_position < 0 || a_pointsize < 0)
    {
        console.log('获取属性变量位置失败！');
        return;
    }

    var sizes = new Float32Array([
       10.0, 20.0, 30.0
    ]);
    //创建缓冲区
    var vbuff = gl.createBuffer();
    if(!vbuff)
    {
        console.log("无法创建缓冲区！");
        return -1;
    }
    //不能连续调用bindBuffer，然后再bufferData设置值，这样会覆盖掉第一个buffer，只会设置第二个buffer的值，设置两次
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuff);
    gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW);

    //使用单个buffer存储值，根据步长和偏移量来定位数据位置
    var FSIZE = vertexs.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_position);

    gl.vertexAttribPointer(a_pointsize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
    gl.enableVertexAttribArray(a_pointsize);
    return n;
}