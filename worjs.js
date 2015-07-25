var found = [];
var f;
var words = [];
var letters = "";

function find_words() {
    var reg = new RegExp("^(?!.*?(.).*?\1)["+letters+"]*["+letters+"]*$");
  	found = [];
    f = [];
    for ( var i in words ) {
      w = words[i];
  
      contains = w.match(reg);
  	
      if ( w.length && contains ) {
        f.push(w);
      }
    }
 

  for ( var i in f ) {
  	var add = true;

  	if ( f.length ) {
		for ( var j in letters ) {
			var num_letters = letters.split(letters[j]).length -1;
			var num_of_occurences = f[i].split(letters[j]).length-1;

			if ( num_of_occurences > num_letters ) {
				add = false;
			}
		}
	}
	else {
		add = false;
	}

	if ( add ) {
		found.push(f[i]);
	}
  }

  found.sort(function(a, b){
    return b.length - a.length; // ASC -> a - b; DESC -> b - a
  });

  document.getElementById('results-list').innerHTML = '<ul><li>' + found.join("</li><li>") + '</li></ul>';

}

var client = new XMLHttpRequest();

client.open('GET', 'word-list-en.txt');

client.onreadystatechange = function() {

  	if ( client.readyState==4 && client.status==200 ) {
	  	file = client.responseText;
		words = file.split(/\n\r|\n/);
	}
}

client.send();


document.getElementById('find-words-form').addEventListener('submit', function(e){

	letters = document.getElementById('letters').value;
	find_words();

	e.preventDefault();
	return false;
});
