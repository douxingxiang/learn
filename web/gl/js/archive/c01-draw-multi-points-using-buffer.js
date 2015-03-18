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

    gl.drawArrays(gl.LINES, 0, n);
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
 * 给顶点着色器传递多个值
 *
 * 1.   创建缓冲区              gl.createBuffer()
 * 2.   将缓冲区绑定到目标       gl.bindBuffer()
 * 3.   设置缓冲区数据          gl.bufferData()
 * 4.   将缓冲区赋值给属性变量   gl.vertexAttribPointer()
 * 5.   启用赋值              gl.enableVertexAttribArray()
 */

/**
 * 创建缓冲区
 *
 * gl.createBuffer()
 * gl.deleteBuffer(buffer)
 */

/**
 * 将缓冲区绑定到目标
 *
 * gl.bindBuffer(target, buffer)
 *  target 目标
 *      gl.ARRAY_BUFFER         包含顶点数据
 *      gl.ELEMENT_ARRAY_BUFFER 包含顶点数据的索引值
 */

/**
 * 设置缓冲区数据
 *
 * gl.bufferData(target, data, usage)
 *  target
 *      gl.ARRAY_BUFFER
 *      gl.ELEMENT_ARRAY_BUFFER
 *  data
 *      typed array，类型数组
 *  usage   用于WebGL的性能优化提示
 *      gl.STATIC_DRAW  缓冲区数据指定一次，使用多次
 *      gl.STREAM_DRAW  缓冲区数据指定一次，使用几次
 *      gl.DYNAMIC_DRAW 缓冲区数据指定多次，使用多次
 */

/**
 * Typed Array类型数组
 *
 * 类型           元素字节数
 * Int8Array        1
 * Uint8Array       1
 * Int16Array       2
 * Uint16Array      2
 * Int32Array       4
 * Uint32Array      4
 * Float32Array     4
 * Float64Array     8
 *
 * 支持的操作
 * get(index)           获取索引为孩子元素值
 * set(index, value)    设置索引位置元素值
 * set(array, offset)   从offset开始设置数组
 * length               元素数目
 * BYTES_PER_ELEMENT    元素字节数
 */

/**
 * 给属性变量赋值
 *
 * gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
 *  location    属性变量位置
 *  size        每个顶点指定的数据数目[1, 4]
 *  type        数据格式
 *      gl.UNSIGNED_BYTE    Uint8Array
 *      gl.SHORT            Int16Array
 *      gl.UNSIGNED_SHORT   Uint16Array
 *      gl.INT              Int32Array
 *      gl.UNSIGNED_INT     Uint32Array
 *      gl.FLOAT            Float32Array
 *  normalized  [true, false]
 *      指定非浮点数据是否要标准化到[0,1]或[-1,1]范围内
 *  stride
 *      步幅  顶点数据之间的步长，0表示默认步长
 *  offset
 *      缓冲区的顶点数据开始存储位置（字节）
 */

/**
 * 启用赋值
 *
 * gl.enableVertexAttribArray(location)
 * gl.disableVertexAttribArray(location)
 */

/**
 * 绘制
 *
 * gl.drawArrays(mode, first, count)
 *  count   绘制的顶点数目
 */
