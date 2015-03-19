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

    //设置canvas清除颜色：黑色不透明，一直有效
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var u_fragcolor = gl.getUniformLocation(gl.program, 'u_fragcolor');
    if(u_fragcolor < 0)
    {
        console.log('获取统一变量位置失败！');
        return;
    }
    gl.uniform4f(u_fragcolor, 1.0, 0.0, 0.0, 1.0);

    gl.drawArrays(gl.TRIANGLES, 0, n);
    //gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl)
{
    var vertexs = new Float32Array([
        0.0,    0.3,    10.0,   1.0,    0.0,    0.0,
        -0.3,   -0.3,   20.0,   0.0,    1.0,    0.0,
        0.3,    -0.3,   30.0,   0.0,    0.0,    1.0
    ]);
    var n = 3;

    //获取属性变量位置
    var a_position = gl.getAttribLocation(gl.program, 'a_position');
    var a_pointsize = gl.getAttribLocation(gl.program, 'a_pointsize');
    var a_color = gl.getAttribLocation(gl.program, 'a_color');
    if(a_position < 0 || a_pointsize < 0 || a_color < 0)
    {
        console.log('获取属性变量位置失败！');
        return;
    }

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

    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_position);

    gl.vertexAttribPointer(a_pointsize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
    gl.enableVertexAttribArray(a_pointsize);

    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_color);
    return n;
}
/**
 * 定点着色器和片段着色器之间有两个过程
 *
 * 几何形状组装过程
 *      gometric shape assembly process
 *      根据定点坐标和drawArrays的mode参数指定几何形状
 * 栅格化过程
 *      rasterization process
 *      将上一过程生成的几何形状转换为片段
 */

/**
 * 0. 顶点着色器开始处理顶点坐标和大小等
 * 1. 对gl_Position赋值，坐标将会保存在几何形状组装过程中
 * 2. 顶点着色器处理结束，几何形状组装开始
 * 3. 利用顶点坐标，还有mode来决定几何形状
 * 4. 根据几何形状开始栅格化过程，几何形状将会转换为多个片段
 * 5. 片段着色器开始处理，将每个片段进行颜色填充，输出到颜色缓冲区
 */