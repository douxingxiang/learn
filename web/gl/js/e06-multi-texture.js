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
    //设置canvas清除颜色：黑色不透明，一直有效
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //创建顶点缓冲区
    var n = initVertexBuffers(gl);
    if(n < 0)
    {
        console.log('设置顶点位置失败！');
        return;
    }
    initTextures(gl, n);
}

function initTextures(gl, n)
{
    //创建一个纹理缓冲区
    var texture0 = gl.createTexture();
    var texture1 = gl.createTexture();
    //读取2d纹理属性变量
    var u_sampler0 = gl.getUniformLocation(gl.program, 'u_sampler0');
    var u_sampler1 = gl.getUniformLocation(gl.program, 'u_sampler1');
    //加载一个图片
    var image0 = new Image();
    var image1 = new Image();
    image0.onload = function() {
        loadTexture(gl, n, texture0, u_sampler0, image0, 0);
    };
    image1.onload = function() {
        loadTexture(gl, n, texture1, u_sampler1, image1, 1);
    };
    image0.src = "img/sky.jpg";
    image1.src = "img/douxingxiang.jpg";
    return true;
}

var loadCnt = 0;
function initVertexBuffers(gl)
{
    //纹理坐标与WebGL坐标映射关系
    var vertexs = new Float32Array([
        -0.5,   0.5,    0.0,    1.0,
        -0.5,   -0.5,   0.0,    0.0,
        0.5,    0.5,    1.0,    1.0,
        0.5,    -0.5,   1.0,    0.0
    ]);
    var n = 4;

    //获取属性变量位置
    var a_position = gl.getAttribLocation(gl.program, 'a_position');
    var a_textcoord = gl.getAttribLocation(gl.program, 'a_textcoord');
    if(a_position < 0 && a_textcoord < 0)
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

    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_position);

    gl.vertexAttribPointer(a_textcoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_textcoord);
    return n;
}

/**
 * gl.createTexture()
 *  创建纹理对象来保存图片
 *  gl.TEXTURE0, gl.TEXTURE7
 *      每个都有一个关联的gl.TEXTURE_2D指定的纹理目标
 * gl.deleteTexture(texture)
 */
function loadTexture(gl, n, texture, u_sampler, image, pos)
{
    loadCnt++;
    //翻转图片坐标系
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //使用纹理目标0
    if(pos == 0)
        gl.activeTexture(gl.TEXTURE0);
    else
        gl.activeTexture(gl.TEXTURE1);
    //绑定目标的2d类型
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //设置纹理填充参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //设置纹理图片
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    //将纹理目标0传递给属性变量
    gl.uniform1i(u_sampler, pos);

    //绘图
    if(loadCnt == 2)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

/**
 * gl.pixelStorei(pname, param)
 *  加载图片后进行pname和param指定的操作
 *  pname
 *      gl.UNPACK_FLIP_Y_WEBGL
 *          翻转图片的Y坐标，默认false
 *      gl.UNPACK_PERMULTIPLY_ALPYA_WEBGL
 *          每个rgb乘以一个系数，默认false
 */

/**
 * gl.activeTexture(texUnit)
 * 指定激活的纹理单元
 *  gl.TEXTURE0...TEXTURE7
 */

/**
 * gl.bindTexture(target, texture)
 * 将texture指定的纹理对象绑定到target纹理单元上
 * texture
 *  gl.TEXTURE_2D   2D纹理
 *  gl.TEXTURE_CUBE_MAP 3D纹理映射
 */

/**
 * gl.texParameteri(target, pname, param)
 * 设置纹理对象参数
 *
 * target   指定纹理对象类型
 *  gl.TEXTURE_2D
 *  gl.TEXTURE_CUBE_MAP
 * pname
 *  指定纹理单元
 * param
 *  指定pname的值
 *  放大  magnification method
 *      gl.TEXTURE_MAG_FILTER   默认值gl.LINEAR
 *  缩小  minification method
 *      gl.TEXTURE_MIN_FILTER   默认值gl.NEAREST_MIPMAP_LINEAR
 *  左右包装
 *      gl.TEXTURE_WRAP_S   默认值gl.REPEAT
 *  上下包装
 *      gl.TEXTURE_WRAP_T   默认值gl.REPEAT
 *
 *
 *  可以设置给gl.TEXTURE_MAG_FILTER, gl.TEXTURE_MIN_FILTER
 *      gl.NEAREST  使用距离当前像素点最近的纹理像素值
 *      gl.LINEAR   使用距离当前像素点最近的4个纹理像素的平均值，更清晰但耗时
 *      gl.NEAREST_MIPMAP_NEAREST
 *      gl.LINEAR_MIPMAP_NEAREST
 *      gl.NEAREST_MIPMAP_LINEAR
 *      gl.LINEAR_MIPMAP_LINEAR
 *
 *  可以设置给gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T, st坐标系
 *      gl.REPEAT           重复
 *      gl.MIRRORED_REPEAT  镜像重复
 *      gl.CLAMP_TO_EDGE    边界颜色
 */

/**
 * 给纹理对象赋值纹理图片
 * gl.texImage2D(target, level, internalformat, format, type, image)
 *  target  纹理对象类型
 *  level   0
 *  internalformat  图片的内部格式
 *  format  纹理像素的格式，与internalformat相同
 *  type    纹理像素数据类型
 *  image   Image对象
 */

/**
 * internalformat 格式
 *  gl.RGB              red, green, blue
 *  gl.RGBA             red, green, blue, alpha
 *  gl.ALPHA            0   0   0   alpha
 *  gl.LUMINANCE        L, L, L, 1 L:Luminance
 *  gl.LUMINANCE_ALPHA  L, L, L, alpha
 */

/**
 * format 格式
 * gl.UNSINGED_BYTE             每个颜色1字节
 * gl.UNSIGNED_SHORT_5_6_5      RGB每个颜色5,6,5位
 * gl.UNSIGNED_SHORT_4_4_4_4    RGBA每个颜色4,4,4,4位
 * gl.UNSIGNED_SHORT_5_5_5_1    RGBA颜色5位，透明度1位
 */

/**
 * 给片段着色器传递纹理单元
 * sampler2D    gl.TEXTURE_2D数据类型
 * samplerCube  gl.TEXTURE_CUBE_MAP数据类型
 */

/**
 * 纹理像素点颜色
 * vec4 texture2D(sampler2D sampler, vec2 coord)
 *  sampler 指定纹理单元数
 *  coord   指定纹理坐标
 * 返回值根据interformat的值不同
 *  gl.RGB              red, green, blue, 1.0
 *  gl.RGBA             red, green, blue, alpha
 *  gl.ALPHA            0   0   0   alpha
 *  gl.LUMINANCE        L, L, L, 1 L:Luminance
 *  gl.LUMINANCE_ALPHA  L, L, L, alpha
 */