function Pet(words){
    this.words = words
    this.speak = function(){
        console.log(this.words)
    }
}

function Dog(words){
    Pet.call(this, words)
    Pet.call(this, arguments)
    }

var Dog = new Dog('wang')
dog.speak()
