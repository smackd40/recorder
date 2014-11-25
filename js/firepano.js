var spinner = new Spinner({color: '#ddd'});
var firebaseRef = 'https://firepano.firebaseio.com/';

function uploadToFireBase(mp3Data) {
  
 
      var filePayload = mp3Data;  
		__log('Uploading...mp3.....' );
      // Generate a location that can't be guessed using the file's contents and a random number
      var hash = CryptoJS.SHA256(Math.random() + CryptoJS.SHA256(filePayload));
      var f = new Firebase(firebaseRef + 'pano/' + hash + '/filePayload');
      spinner.spin(document.getElementById('spin'));
      // Set the file payload to Firebase and register an onComplete handler to stop the spinner and show the preview
      f.set(filePayload, function() { 
      spinner.stop(); 
	  //console.log("f",f,firebaseRef + 'pano/' + hash + '/filePayload');
	  __log('Uploading...completed.....' );
  
        // Update the location bar so the URL can be shared with others
        window.location.hash = hash;
		__log('Listen uploaded...audio...'+window.location );
      });
    
 
}


$(function() {
  $('#spin').append(spinner);

  var idx = window.location.href.indexOf('#');
  var hash = (idx > 0) ? window.location.href.slice(idx + 1) : '';
  if (hash === '') {
    // No hash found, so render the file upload button.
    $('#file-upload').show();
    //document.getElementById("file-upload").addEventListener('change', handleFileSelect, false);
  } else {
    // A hash was passed in, so let's retrieve and render it.
    spinner.spin(document.getElementById('spin'));
    var f = new Firebase(firebaseRef + '/pano/' + hash + '/filePayload');
    f.once('value', function(snap) {
      var payload = snap.val();
	  console.log("payload",payload);
      if (payload != null) {
        document.getElementById("pano-audio").src = payload;
		$('#pano-audio').show();
      } else {
        $('#body').append("Not found");
      }
      spinner.stop();
    });
  }
});
