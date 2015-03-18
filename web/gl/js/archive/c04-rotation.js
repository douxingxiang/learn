/**
 * Created by francis on 2015/3/17.
 */
/////////////////////////////////
// WebGL的绘图机制称作着色器（Shader）
/////////////////////////////////

var gl;
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
    var angle = 90.0;
    var radian = Math.PI * angle / 180.0;
    var cosb = Math.cos(radian);
    var sinb = Math.sin(radian);
    var u_cosb = gl.getUniformLocation(gl.program, 'u_cosb');
    var u_sinb = gl.getUniformLocation(gl.program, 'u_sinb');
    gl.uniform1f(u_cosb, cosb);
    gl.uniform1f(u_sinb, sinb);

    var u_fragcolor = gl.getUniformLocation(gl.program, 'u_fragcolor');
    if(u_fragcolor < 0)
    {
        console.log('获取统一变量位置失败！');
        return;
    }
    gl.uniform4f(u_fragcolor, 1.0, 0.0, 0.0, 1.0);

    //设置canvas清除颜色：黑色不透明，一直有效
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl)
{
    var vertexs = new Float32Array([
        0.0, 0.5,  -0.5, -0.5,  0.5, -0.5
    ]);
    var n = vertexs.length / 2;

    //创建缓冲区
    var vbuff = gl.createBuffer();
    if(!vbuff)
    {
        console.log("无法创建缓冲区！");
        return -1;
    }
    //设置缓冲区数据类型
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuff);
    //设置数据
    gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAW);

    //获取属性变量位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0)
    {
        console.log('获取属性变量位置失败！');
        return;
    }
    //将缓冲区赋值给属性变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    //启用赋值
    gl.enableVertexAttribArray(a_Position);
    return n;
}

/**
 * 旋转 rotation
 *
 * 右手规则旋转 right-hand-rule rotation
 * x' = xcosb - ysinb
 * y' = xsinb + ycosb
 * z' = z
 *
 * 变换矩阵 transformation matrix
 * 旋转矩阵 rotation matrix
 * cosb -sinb   0
 * sinb cosb    0
 * 0    0       1
 *
 *
 */