# node-epi-intra

Node.js library to access informations on Epitech's intranet.

## Introduction
Simple code.

```js
var Session = require('./index').Session;

var login = 'hervie_g',
    password = 'nyan';

var sess = new Session(login);
sess.login(password, function(err) {
    if (!err)
    {
        sess.notes(login, function(notes) {
            for (var i in notes)
            {
                var note = notes[i];
                console.log(note.name, ' : ', note.value);
            }
        });
    }
    else
    {
        console.error(err);
    }
});
```

## API

### .login(password, callback)
Login with password provided, and callback with an error message if there's any, or null if there's not.

```js
sess.login('kiwi', function(err) {
    if (!err)
    {
        // Do some stuff...
    }
    else
    {
        console.error(err);
    }
});

### .notes(who, callback)
Get who's notes from his rapport page.

```js
sess.notes('noel_p', function(notes) {
    // Play with notes. <3
});
```

#### Note object

* `date` Date. What else?
* `module` Module code.
* `name` Project name.
* `value` Value of the note obtained [type: float]
* `comments` Comments associated with the note.

### .modules(who, callback)
Get who's modules results from his rapport page.

```js
sess.modules('ns', function(m) {
    // Mod, mod, module!
});
```

#### Module object

* `code` Module code.
* `name` Module name.
* `profs` Array of prof logins for this module. [type: array]
* `credits` Credits associated with this module. [type: int]
* `infos` Module's additionnals informations.
* `status` Module's current status ('En cours', 'Acquis', etc...)
* `grade` Module's final grade ('-' if the module has not yet be evaluated)
* `reward` Module's reward (smiley <3) if there's any. null otherwise.

## ToDo

* Add moar functions
