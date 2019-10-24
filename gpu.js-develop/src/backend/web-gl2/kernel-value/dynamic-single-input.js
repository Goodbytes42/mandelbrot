const { utils } = require('../../../utils');
const { WebGL2KernelValueSingleInput } = require('../../web-gl2/kernel-value/single-input');

class WebGL2KernelValueDynamicSingleInput extends WebGL2KernelValueSingleInput {
  getSource() {
    return utils.linesToString([
      `uniform highp sampler2D ${this.id}`,
      `uniform highp ivec2 ${this.sizeId}`,
      `uniform highp ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(value) {
    let [w, h, d] = value.size;
    this.dimensions = new Int32Array([w || 1, h || 1, d || 1]);
    this.textureSize = utils.getMemoryOptimizedFloatTextureSize(this.dimensions, this.bitRatio);
    this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio;
    this.uploadValue = new Float32Array(this.uploadArrayLength);
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(value);
  }
}

module.exports = {
  WebGL2KernelValueDynamicSingleInput
};