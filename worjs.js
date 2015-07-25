var found = [];
var words = [];

function find_words() {
    var letters = "dog";
    var reg = new RegExp("^(?!.*?(.).*?\1)["+letters+"]*["+letters+"]*$");
  
    found = []; 
    for ( var i in words ) {
      w = words[i]; 
  
      contains = w.match(reg);
  
      if ( contains ) {
        found.push(w);
      }
    }
  
  found.sort(function(a, b){
    return b.length - a.length; // ASC -> a - b; DESC -> b - a
  });

  for ( var i in found ) {
	for ( var j in letters ) {
		var num_letters = letters.split(letters[j]).length -1;
		var num_of_occurences = found[i].split(letters[j]).length-1;
		if ( num_of_occurences > num_letters ) {
			delete found[i];
		}
	}
  }

  console.log(found);
}

var client = new XMLHttpRequest();

client.open('GET', 'word-list-en.txt');

client.onreadystatechange = function() {

  	if ( client.readyState==4 && client.status==200 ) {
	  	file = client.responseText;
		words = file.split(/\n\r|\n/);

		find_words();
	}
}

client.send();

