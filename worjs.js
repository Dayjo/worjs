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

  console.log(found);
}

var client = new XMLHttpRequest();

client.open('GET', 'word-list-en.txt');

client.onreadystatechange = function() {
  file = client.responseText;

  words = file.split(/\n\r|\n/);

  find_words();
}

client.send();

