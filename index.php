<!DOCTYPE html>
<html>

<head>
  <title>Pixel Art Maker!</title>

  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
  <link href="styles.css" rel="stylesheet">

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

  <!-- Farbstastic Color Picker -->
  <link href="farbtastic/farbtastic.css" rel="stylesheet">
  <script src="farbtastic/farbtastic.js"></script>
</head>

<body>
  <div id="overlay" class="overlay-background"></div>

  <h1>Pixel Art Maker</h1>

  <!-- Button for open the instructions -->
  <div id="show-instructions" class="instructions-toggle">
    <h1>?</h1>
  </div>

  <!-- Instructions section -->
  <div id="instructions" class="instructions" style="display: none;">
    <h2>Instructions</h2>
    <div id="close-instructions" class="instructions-toggle">
      <h2><i class="fa fa-times icon" aria-hidden="true"></i></h2>
    </div>
    <ul>
      <li>Set size of canvas</li>
      <li>Pick the color</li>
      <li>Click to fill the cell with selected color</li>
      <li class="main-feature">Hold mouse down and draw smoothly</li>
      <li>Click secondary mouse button to erase</li>
      <li class="main-feature">Hold secondary button to erase smoothly</li>
      <li class="main-feature">Save your drawings to PNG image</li>
      <li class="main-feature">Share your art!</li>
    </ul>
  </div>

  <!-- Grid set up section -->
  <div id="setup">
    <div>
      <h2>Choose Grid Size</h2>
      <form id="size-picker">
        <div class="grid-parameter">
          <h4>Height</h4>
          <input type="number" id="input-height" name="height" min="1" value="15">
        </div>
        <i class="fa fa-times icon" aria-hidden="true"></i>
        <div class="grid-parameter">
          <h4>Width</h4>
          <input type="number" id="input-width" name="width" min="1" value="40">
        </div>
        <p>
          <button type="submit" class="button button-default">Start New Drawing</button>
        </p>
      </form>
    </div>
    <div id="thumbnails">
      <h2>Or Select One of Users Created Presets</h2>
      <?php
        $files = glob('share/*.png');
        usort($files, create_function('$a,$b', 'return filemtime($b) - filemtime($a);'));

        foreach($files as $file) {
          $filename = pathinfo($file)['filename'];

          $date = DateTime::createFromFormat('Ymdhis', substr($filename, 0, 14));
          $name = substr($filename, 15, strlen($file));

          echo '<div class="thumbnail" data-href="share/' . $filename . '.save">';
          echo '<div class="thumbnail-img" style="background-image: url(\'' . $file . '\');"></div>';
          echo '<div>' . $name . '</div>';
          echo '<div class="thumbnail-date">' . $date -> format('Y-m-d h:i') . '</div>';
          echo '</div>';
        }
      ?>
    </div>
  </div>

  <!-- Drawing area section -->
  <div id="layout">
    <h2>Pick A Color</h2>
    <div id="color-picker"></div>
    <div id="palette"></div>

    <h2>Design Canvas</h2>
    <table id="pixel-grid"></table>
  </div>

  <!-- Share form section -->
  <div id="share-section" class="popup">
    <form id="share-form">
      <h2>Please, type name of your Art</h2>
      <input type="text" name="name">
      <input type="hidden" name="data">
      <input type="hidden" name="thumbnail">
      <button type="submit" class="button button-save">Share</button>
    </form>
  </div>

  <!-- Footer section with buttons -->
  <footer>
    <div id="control-buttons" style="display: none;">
      <a id="clear-button" class="button button-default">Clear Canvas</a>
      <a id="reset-button" class="button button-default">Start New</a>
      <a id="save-button" class="button button-save">Save Picture</a>
      <a id="share-button" class="button button-save">Share</a>
    </div>
  </footer>

  <script src="designs.js"></script>
</body>

</html>
