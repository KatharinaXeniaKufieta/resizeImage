var MAX_CANVAS_SIZE = 500;
var CANVAS_MARGIN = 50;

var ViewModel = function() {
  var self = this;
  this.canvasWidth = ko.observable('30');
  this.canvasHeight = ko.observable('30');

  this.canvas = document.getElementById('canvas');
  this.context = canvas.getContext('2d');
  this.image = document.getElementById('source');
  this.imageWidth = this.image.width;
  this.imageHeight = this.image.height;
  // The (resized) image is defined by the upper left and 
  // lower right point called: topLeft and bottomRight
  this.topLeftX = 0;
  this.topLeftY = 0;
  this.bottomRightX = NaN;
  this.bottomRightY = NaN;
  this.cursorPosition = "Out";
  this.mouseDownX = NaN;
  this.mouseDownY = NaN;
  this.mouseUpX = NaN;
  this.mouseUpY = NaN;
  this.resizing = false;

	// Scales the image accordingly to the maximum canvas size
  // so it will fit into the canvas and keep it's ratio between
  // width and height.
  this.scaleImage = function() {
    var ratio = self.imageHeight / self.imageWidth;
    console.log(ratio);
    if (self.imageHeight > self.imageWidth &&
      self.imageHeight > MAX_CANVAS_SIZE) {
      self.canvasHeight(MAX_CANVAS_SIZE);
      self.canvasWidth(self.canvasHeight() / ratio);
    } else if (self.imageWidth > self.imageHeight &&
      self.imageWidth > MAX_CANVAS_SIZE) {
      self.canvasWidth(MAX_CANVAS_SIZE);
      self.canvasHeight(ratio * self.canvasWidth());
    } else {
      self.canvasHeight(self.imageHeight);
      self.canvasWidth(self.imageWidth);
    }
    self.topLeftX = CANVAS_MARGIN;
  	self.topLeftY = CANVAS_MARGIN;
    self.bottomRightX = self.canvasWidth();
    self.bottomRightY = self.canvasHeight();
    self.canvasWidth(self.canvasWidth() + CANVAS_MARGIN);
    self.canvasHeight(self.canvasHeight() + CANVAS_MARGIN);
  };

	// After rendering the canvas, draw the image inside the canvas.
  this.myAfterRender = function() {
    console.log('after render');
    self.context.fillStyle = 'white';
    self.context.fillRect(0, 0, self.canvasWidth(), self.canvasHeight());
    self.context.drawImage(self.image, 0, 0, self.imageWidth, self.imageHeight, self.topLeftX, self.topLeftY, self.canvasWidth() - 2*CANVAS_MARGIN, self.canvasHeight() - 2*CANVAS_MARGIN);
  };

	// enablePulling recognizes in which area the cursor enters the image.
  // It indicates the option to resize the image to the user:
  // diagonally, horizontally or vertically.
  this.enablePulling = function(data, evt) {
    console.log('Mouser Over: In enablePulling');
    var canvasOffsetTop = self.canvas.offsetTop;
    var canvasOffsetLeft = self.canvas.offsetLeft;

    // relativeMouse is the relative position of the mouse within the canvas.
    var relativeMouseX = evt.clientX - canvasOffsetLeft;
    var relativeMouseY = evt.clientY - canvasOffsetTop;
    if (!self.resizing && relativeMouseX > self.topLeftX && relativeMouseY > self.topLeftY && relativeMouseX < self.bottomRightX && relativeMouseY < self.bottomRightY) {
      if (relativeMouseX - self.topLeftX < 20 && relativeMouseY - self.topLeftY < 20) {
        console.log('Upper left corner');
        self.canvas.style.cursor = "nwse-resize";
      } else if (Math.abs(relativeMouseX - self.bottomRightX) < 20 && Math.abs(relativeMouseY - self.bottomRightY) < 20) {
        console.log('Bottom right corner');
        self.canvas.style.cursor = "nwse-resize";
      } else if (relativeMouseX - self.topLeftX < 20 && Math.abs(relativeMouseY - self.bottomRightY) < 20) {
        console.log('Bottom left corner');
        self.canvas.style.cursor = "nesw-resize";
      } else if (Math.abs(relativeMouseX - self.bottomRightX) < 20 && relativeMouseY - self.topLeftY < 20) {
        console.log('Upper right corner');
        self.canvas.style.cursor = "nesw-resize";
      } else if (relativeMouseX - self.topLeftX > 20 && Math.abs(relativeMouseX - self.bottomRightX) > 20 && relativeMouseY - self.topLeftY < 20) {
        console.log('Upper border');
        self.canvas.style.cursor = "ns-resize";
      } else if (relativeMouseX - self.topLeftX > 20 && Math.abs(relativeMouseX - self.bottomRightX) > 20 && Math.abs(relativeMouseY - self.bottomRightY) < 20) {
        console.log('Bottom border');
        self.canvas.style.cursor = "ns-resize";
      } else if (relativeMouseX - self.topLeftX < 20 && Math.abs(relativeMouseY - self.bottomRightY) > 20 && relativeMouseY - self.topLeftY > 20) {
        console.log('Left border');
        self.canvas.style.cursor = "ew-resize";
      } else if (Math.abs(relativeMouseX - self.bottomRightX) < 20 && Math.abs(relativeMouseY - self.bottomRightY) > 20 && relativeMouseY - self.topLeftY > 20) {
        console.log('Right border');
        self.canvas.style.cursor = "ew-resize";
      }
    }
  };

  this.getResize = function(data, evt) {
    self.resizing = true;
    self.mouseDownX = evt.clientX;
    self.mouseDownY = evt.clientY;
    var canvasOffsetTop = self.canvas.offsetTop;
    var canvasOffsetLeft = self.canvas.offsetLeft;

    // relativeMouse is the relative position of the mouse within the canvas.
    var relativeMouseX = evt.clientX - canvasOffsetLeft;
    var relativeMouseY = evt.clientY - canvasOffsetTop;


    // This will activate resizing either diagonally, horizontally or vertically.
    // It sets the flag 'cursorPosition' that indicates where the user is resizing,
    // from any of the four corners, or the four borders.
    if (relativeMouseX - self.topLeftX < 20 && relativeMouseY - self.topLeftY < 20) {
      self.canvas.style.cursor = "nwse-resize";
      self.cursorPosition = "UpperLeftCorner";
    } else if (Math.abs(relativeMouseX - self.bottomRightX) < 20 && Math.abs(relativeMouseY - self.bottomRightY) < 20) {
      self.canvas.style.cursor = "nwse-resize";
      self.cursorPosition = "BottomRightCorner";
    } else if (relativeMouseX - self.topLeftX < 20 && Math.abs(relativeMouseY - self.bottomRightY) < 20) {
      self.canvas.style.cursor = "nesw-resize";
      self.cursorPosition = "BottomLeftCorner";
    } else if (Math.abs(relativeMouseX - self.bottomRightX) < 20 && relativeMouseY - self.topLeftY < 20) {
      self.canvas.style.cursor = "nesw-resize";
      self.cursorPosition = "UpperRightCorner";
    } else if (relativeMouseX - self.topLeftX > 20 && Math.abs(relativeMouseX - self.bottomRightX) > 20 && relativeMouseY - self.topLeftY < 20) {
      self.canvas.style.cursor = "ns-resize";
      self.cursorPosition = "UpperBorder";
    } else if (relativeMouseX - self.topLeftX > 20 && Math.abs(relativeMouseX - self.bottomRightX) > 20 && Math.abs(relativeMouseY - self.bottomRightY) < 20) {
      self.canvas.style.cursor = "ns-resize";
      self.cursorPosition = "BottomBorder";
    } else if (relativeMouseX - self.topLeftX < 20 && Math.abs(relativeMouseY - self.bottomRightY) > 20 && relativeMouseY - self.topLeftY > 20) {
      self.canvas.style.cursor = "ew-resize";
      self.cursorPosition = "LeftBorder";
    } else if (Math.abs(relativeMouseX - self.bottomRightX) < 20 && Math.abs(relativeMouseY - self.bottomRightY) > 20 && relativeMouseY - self.topLeftY > 20) {
      self.canvas.style.cursor = "ew-resize";
      self.cursorPosition = "RightBorder";
    }
  };

  this.resizeImage = function(data, evt) {
    console.log("Mouse Up");
    self.mouseUpX = evt.clientX;
    self.mouseUpY = evt.clientY;
    var upper = false;
    var left = false;
    var right = false;
    var bottom = false;
    switch (self.cursorPosition) {
      case "UpperLeftCorner":
        upper = true;
        left = true;
        break;
      case "UpperRightCorner":
        upper = true;
        right = true;
        break;
      case "BottomLeftCorner":
        bottom = true;
        left = true;
        break;
      case "BottomRightCorner":
        bottom = true;
        right = true;
        break;
      case "BottomBorder":
        bottom = true;
        break;
      case "UpperBorder":
        upper = true;
        break;
      case "LeftBorder":
        left = true;
        break;
      case "RightBorder":
        right = true;
        break;

      default:
        break;
    }
    if (upper) {
      self.topLeftY += self.mouseUpY - self.mouseDownY;
      self.topLeftY = Math.max(self.topLeftY, CANVAS_MARGIN);
    }
    if (bottom) {
      self.bottomRightY += self.mouseUpY - self.mouseDownY;
      self.bottomRightY = Math.min(self.bottomRightY, self.canvasHeight() - CANVAS_MARGIN);
    }
    if (left) {
      self.topLeftX += self.mouseUpX - self.mouseDownX;
      self.topLeftX = Math.max(self.topLeftX, CANVAS_MARGIN);
    }
    if (right) {
      self.bottomRightX += self.mouseUpX - self.mouseDownX;
      self.bottomRightX = Math.min(self.bottomRightX, self.canvasWidth() - CANVAS_MARGIN);
    }

    self.context.fillStyle = 'rgb(207, 214, 217)';
    self.context.fillRect(CANVAS_MARGIN, CANVAS_MARGIN, self.canvasWidth() - CANVAS_MARGIN*2, self.canvasHeight() - CANVAS_MARGIN*2);
    var width = self.bottomRightX - self.topLeftX;
    var height = self.bottomRightY - self.topLeftY;
    console.log(width);
    console.log(height);
    self.context.drawImage(self.image, 0, 0, self.imageWidth, self.imageHeight, self.topLeftX, self.topLeftY, width, height);
    self.resizing = false;
  };

  this.scaleImage();
};

window.onload = function () {
  console.log('start applying bindings');
  ko.applyBindings(new ViewModel());// This makes Knockout get to work
}
