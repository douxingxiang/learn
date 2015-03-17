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

    //获取属性变量位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0)
    {
        console.log('获取属性变量位置失败！');
        return;
    }
    //给属性变量赋值
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

    var u_fragcolor = gl.getUniformLocation(gl.program, 'u_fragcolor');
    if(u_fragcolor < 0)
    {
        console.log('获取统一变量位置失败！');
        return;
    }

    canvas.onclick = function(e)
    {
        onClick(e, gl, canvas, a_Position, u_fragcolor);
    }

    //设置canvas清除颜色：黑色不透明，一直有效
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];
var g_colors = [];
function onClick(e, gl, canvas, a_Position, u_fragcolor)
{
    var p = getGLPointObjFromClientPoint(canvas, e.clientX, e.clientY);
    g_points.push([p.x, p.y]);

    if(p.x < 0.0 && p.y < 0.0 )
    {
        g_colors.push([1.0, 0.0, 0.0, 1.0]);
    }
    else if(p.x > 0.0 && p.y > 0.0)
    {
        g_colors.push([0.0, 1.0, 0.0, 1.0]);
    }
    else
    {
        g_colors.push([1.0, 1.0, 1.0, 1.0]);
    }

    //使用清除颜色初始化颜色缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for(var i = 0; i < len; i++)
    {
        gl.vertexAttrib2f(a_Position, g_points[i][0], g_points[i][1]);
        gl.uniform4f(u_fragcolor, g_colors[i][0], g_colors[i][1], g_colors[i][2], g_colors[i][3]);

        gl.drawArrays(gl.POINTS, 0, 1);
    }
}