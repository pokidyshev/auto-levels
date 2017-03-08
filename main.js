/**
 * Created by sandpiturtle on 08.03.17.
 */

var PhotoScript = function(image) {

    if (!image) {
        this.image = null;
        return this;
    }

    this.image         = image;
    this.image.insertAdjacentHTML('afterend', '<canvas></canvas>');
    this.canvas        = this.image.nextElementSibling;
    this.ctx           = this.canvas.getContext('2d');
    this.canvas.width  = this.image.width;
    this.canvas.height = this.image.height;
    this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    this.imageDataObject = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.imageData = this.imageDataObject.data;

};


PhotoScript.prototype.show = function(){

    console.log('PhotoScript::show()');
    if ( !this.image ) return this;
    this.ctx.putImageData( this.imageDataObject, 0, 0 );
    this.image.parentNode.removeChild(this.image);
    return this;

};


PhotoScript.prototype.autoLevels = function() {

    console.log('PhotoScript::autoLevels');
    if ( !this.image ) return this;
    var pixelNum = this.imageData.length;

    // INITIALIZE BRIGHTNESS FOR LEVELS
    var redMax   = 0;
    var redMin   = 255;
    var greenMax = 0;
    var greenMin = 255;
    var blueMax  = 0;
    var blueMin  = 255;

    for ( var i = 0; i < pixelNum; i += 4 ) {
        //SET MIN AND MAX VALUES FOR EACH COLOR
        if (this.imageData[i] > redMax)     { redMax = this.imageData[i] }
        if (this.imageData[i] < redMin)     { redMin = this.imageData[i] }
        if (this.imageData[i+1] > greenMax) { greenMax = this.imageData[i+1] }
        if (this.imageData[i+1] < greenMin) { greenMin = this.imageData[i+1] }
        if (this.imageData[i+2] > blueMax)  { blueMax = this.imageData[i+2] }
        if (this.imageData[i+2] < blueMin)  { blueMin = this.imageData[i+2] }
    }

    var redCoeff   = 255 / (redMax - redMin);
    var greenCoeff = 255 / (greenMax - greenMin);
    var blueCoeff  = 255 / (blueMax - blueMin);

    for( i = 0; i < pixelNum; i += 4 ){
        // MAP COLORS TO 0 - 255 RANGE
        this.imageData[i]   = (this.imageData[i] - redMin)     * redCoeff;
        this.imageData[i+1] = (this.imageData[i+1] - greenMin) * greenCoeff;
        this.imageData[i+2] = (this.imageData[i+2] - blueMin)  * blueCoeff;
    }

    return this;
};
