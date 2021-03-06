$(function() {
  // Constants
  const FADE_DURATION = 300;
  const MIN_GRID_SIDE = 2;
  const MAX_GRID_SIDE = 100;
  const IMG_CELL_SIDE = 20;
  const THUMBNAIL_CELL_SIDE = 5;
  const MAX_PALETTE_SIZE = 15;

  const DEFAULT_COLOR = '#3498db';
  const PLACEHOLDER_COLOR = '#e1e1e1';

  // Page elements
  const overlay = $('#overlay');
  const setup = $('#setup');
  const layout = $('#layout');
  const buttons = $('#control-buttons');
  const sizePickerForm = $('#size-picker');
  const grid = $('#pixel-grid');
  const color = $('#color-picker');
  const palette = $('#palette');
  const thumbnails = $('#thumbnails');

  // Instructions elements
  const showInstructions = $("#show-instructions");
  const closeInstructions = $("#close-instructions");
  const instructions = $("#instructions");

  // Buttons
  const clearButton = $('#clear-button');
  const resetButton = $('#reset-button');
  const saveButton = $('#save-button');

  // Share elements
  const shareButton = $('#share-button');
  const shareSection = $('#share-section');
  const shareForm = $('#share-form');

  // Palette
  let currentColor;
  let paletteArray;

  // Grid size;
  let height;
  let width;

  /**
   * @description Initializes working space. Must be called before any other calls
   */
  function init() {
    // Clears everything from any previous grid
    grid.children().remove();

    // Clear the share form
    shareForm.find('input').val('');

    // Set active color to default
    currentColor = DEFAULT_COLOR;

    // Initialize farbtastic
    color.farbtastic(function(e) {
      currentColor = e;
    }, DEFAULT_COLOR);

    // Clear existing palette if any and reset active color to default
    clearPalette();
  }

  /**
   * @description Draws the canvas using provided parameters
   * @param {int} height - The height of the canvas
   * @param {int} width - The width of the canvas
   */
  function makeGrid(height, width, callback) {
    for (let h = 0; h < height; h++) {
      var tr = $('<tr></tr>');

      for (let w = 0; w < width; w++) {
        tr.append('<td></td');
      }

      grid.append(tr);
    }

    callback();
  }

  /**
   * @description Sets color of element in the canvas
   * @param {object} element - The object to set color on
   * @param {string} color - Hexadecimal value of the color to set
   */
  function setColor(element, color) {
    $(element).css('background-color', color);
  }

  /**
   * @description Updates palette of recent colors
   * @param {string} color - Hexadecimal color
   */
  function addColorToPalette(color) {
    // Only if color is not in palette yet
    if (!paletteArray.includes(color)) {
      // Add color to the end of the palette
      paletteArray.push(color);

      // Delete the last element if more than maximum
      if (paletteArray.length > MAX_PALETTE_SIZE) {
        paletteArray.splice(0, 1);
      }

      // Clear the palette and fill with updated colors
      palette.children().remove();
      paletteArray.forEach(function(e) {
        let item = $('<div class="palette-item"></div>');
        item.css('background-color', e);
        palette.append(item);
      });
    }
  }

  /**
   * @description Clears the palette
   */
  function clearPalette() {
    $.farbtastic(color, DEFAULT_COLOR).setColor(DEFAULT_COLOR);

    // Clear palette
    paletteArray = [];
    palette.children().remove();
    for (var i = 0; i < MAX_PALETTE_SIZE; i++) {
      paletteArray.push(PLACEHOLDER_COLOR);

      let item = $('<div class="palette-item"></div>');
      item.css('background-color', PLACEHOLDER_COLOR);
      palette.append(item);
    }
  }

  /**
   * @description Resets color of all cells
   */
  function clearGrid() {
    grid.find('td').each(function() {
      setColor(this, '');
    });
  }

  /**
   * @description Serializes <table> html element to JSON object
   * @param {object} table - <table> html element
   * @param {string} name - Name of the Art
   * @returns {object} - Returns <table> serialized to JSON object
   */
  function serializeTable(table) {
    let colors = [];

    $.each(table.find('td'), function(index, cell) {
      colors.push($(cell).css('background-color'));
    });

    let serialized = {
      height: height,
      width: width,
      colors: colors
    };

    return serialized;
  }

  /**
   * @description Deserializes JSON object into <table> html element
   * @param {object} serialized - JSON object containing serialized <table>
   */
  function deserializeTable(serialized) {
    init();
    makeGrid(serialized.height, serialized.width, function() {
        height = serialized.height;
        width = serialized.width;

      $.each($('#pixel-grid td'), function(i) {
        let hex = $.farbtastic(color).rgbaToHex(serialized.colors[i]);
        addColorToPalette(hex);
        $(this).css('background-color', hex);
      });

      // Adjust view
      setup.fadeOut(FADE_DURATION, function() {
        layout.fadeIn(FADE_DURATION);
        buttons.fadeIn(FADE_DURATION);
      });
    });
  }

  /**
   * @description Draws grid <table> html element to <canvas> html element
   * @param {object} table - JSON object representing grid state
   * @returns {node} - Returns the canvas element
   */
  function getCanvasFromTable(table, cellSide) {
    let serialized = serializeTable(table);

    let canvas = document.createElement('canvas');
    canvas.height = serialized.height * cellSide;
    canvas.width = serialized.width * cellSide;

    let ctx = canvas.getContext('2d');

    let position = 0;
    for (let h = 0; h < serialized.height; h++) {
      for (let w = 0; w < serialized.width; w++) {
        ctx.fillStyle = serialized.colors[position++];
        ctx.fillRect(w * cellSide, h * cellSide, cellSide, cellSide);
      }
    }

    return canvas;
  }

  /**
   * @description Downloads the png from <canvas> html element
   * @param {node} canvas - <canvas> html element
   * @param {string} filename - Name of the file that will be downloaded
   */
  function saveCanvasToImage(canvas, fileName) {
    let dataURL = canvas.toDataURL();
    let download = document.getElementById('save-button');
    download.href = dataURL;
    download.download = fileName;
  }

  // Listen event to show instructions
  showInstructions.on('click', function() {
    showInstructions.fadeOut(FADE_DURATION / 2, function() {
      instructions.fadeIn(FADE_DURATION / 2);
    });
  });

  // Listen event to hide instructions
  closeInstructions.on('click', function() {
    instructions.fadeOut(FADE_DURATION / 2, function() {
      showInstructions.fadeIn(FADE_DURATION / 2);
    });
  });

  // Set color by click
  grid.on('click', 'td', function(e) {
    setColor(this, currentColor);
    addColorToPalette(currentColor);
  });

  // Reset color by right click
  grid.on('contextmenu', 'td', function(e) {
    e.preventDefault();
    setColor(this, '');
  });

  // This function is used for possibility to draw
  // smoothly on the canvas with a single mouse hold
  // Reset color by moving cursor with right button down
  grid.on('mousemove', 'td', function(e) {
    e.preventDefault();
    if (e.buttons == 1 || e.buttons == 3) {
      setColor(this, currentColor);
      addColorToPalette(currentColor);
    } else if (e.buttons == 2) {
      setColor(this, '');
    }
  });

  // Apply canvas size set by user
  sizePickerForm.submit(function(e) {
    e.preventDefault();

    init();

    // Remember values of canvas parameters
    height = $('#input-height').val();
    width = $('#input-width').val();

    // Alert if the canvas is too small
    if (height < MIN_GRID_SIDE || width < MIN_GRID_SIDE) {
      alert('Each canvas side size must be at least 2');
      return;
    }

    if (height > MAX_GRID_SIDE || width > MAX_GRID_SIDE) {
      alert('Each side of canvas is limited to 100');
      return
    }

    // Apply
    makeGrid(height, width, function() {
      // Adjust view
      setup.fadeOut(FADE_DURATION, function() {
        layout.fadeIn(FADE_DURATION);
        buttons.fadeIn(FADE_DURATION);
      });
    });
  });

  // Clear the drawing area
  clearButton.on('click', function() {
    clearGrid();
  });

  // Delete current drawing area and let user to
  // set his new canvas to draw
  resetButton.on('click', function() {
    overlay.click();
    buttons.fadeOut(FADE_DURATION);
    layout.fadeOut(FADE_DURATION, function() {
      setup.fadeIn(FADE_DURATION);
    });
  });

  // Listen event click on save button
  // And save picture to png
  saveButton.on('click', function() {
    let canvas = getCanvasFromTable(grid, IMG_CELL_SIDE);
    saveCanvasToImage(canvas, 'image.png');
  });

  // Open share form by click on Share button
  shareButton.on('click', function() {
    overlay.fadeIn(FADE_DURATION);
    shareSection.fadeIn(FADE_DURATION);
    shareForm.fadeIn(FADE_DURATION);

    // Add general data to form
    let serialized = serializeTable(grid);
    shareForm.find('input[name=name]').val('My Creative Art');
    shareForm.find('input[name=data]').val(JSON.stringify(serialized));

    // Add thumbnail data to form
    let img = getCanvasFromTable(grid, THUMBNAIL_CELL_SIDE);
    shareForm.find('input[name=thumbnail]').val(img.toDataURL());

    shareForm.find('input[name=name]').focus();
  });

  // Send data to server by submitting share form
  shareForm.on('submit', function(e) {
    e.preventDefault();

    $.post('save.php', $(this).serialize(), function() {
      shareForm.fadeOut(FADE_DURATION, function() {
        let block = $('<div></div>')
        $(block).css('display', 'none');

        let buttons = $('<div></div>');
        let startNewButton = $('<a class="button button-save">Start New</a>');
        let continueButton = $('<a class="button button-default">Continue Drawing</a>');

        startNewButton.on('click', function() {
          location.reload(true);
        });

        continueButton.on('click', function() {
          overlay.click();
          setTimeout(function() {
            block.remove();
          }, 1000);
        });

        buttons.append(startNewButton);
        buttons.append(continueButton);

        buttons.find('a')
          .css('margin', '20px 5px')
          .css('display', 'inline-block');

        block.append('<h2>Your Art has been successfully uploaded</h2>');
        block.append(buttons);
        shareSection.append(block);

        block.fadeIn(FADE_DURATION);
      });
    });
  });

  // Load art by click on thumbnail
  thumbnails.on('click', '.thumbnail', function(e) {
    let url = $(this).attr('data-href');
    $.get(url, function(response) {
       deserializeTable(JSON.parse(response));
    });
  })

  // when click on overlay, close all popups
  overlay.on('click', function() {
    overlay.fadeOut(FADE_DURATION);
    $('.popup').fadeOut(FADE_DURATION);
  });

  // Pick color from palette
  palette.on('click', 'div', function(e) {
    let bg = $(e.target).css('background-color');
    let hex = $.farbtastic(color).rgbaToHex(bg);

    // Set active color
    currentColor = hex;

    // Update color picker
    $.farbtastic(color, hex).setColor(hex);
  });
})
