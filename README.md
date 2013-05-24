jquery.i18n.PoExporter
======================
With this plugin you can generate a client side .po file based on the 'data-i18n' (configurable) parameter of any HTML tag.

How to use
---------------------
Add the jquery.i18n.poexporter.js file to your header
Then call the plugin once
    $().i18nPoExporter();

This will add a "Create PO" button at the end of your page if any tag with the 'data-i18n' parameter exists.
This will create a second button ( with the javascript createObjectURL method ) that clicked, will download the client side generated po file.
Thats simple !

Options
----------------------
You can add parameters when you initialise the exporter :

    $().i18nPoExporter(
        filename: "translation.po",
        existing : {'hello' : 'Bonjour'},
        paramkey : '[data-i18n]'
    )

filename : The name of the file that will be exported ( default to 'translation.po')

existing : the existing translation object as jquery.i18n use.
This is very usefull because the poexporter will only generate a po file with the texts that are on the page.
You might want to have only one global po file for your site / webapp, so this is where you give poExporter the already existing tranlation set.

paramkey : the name of the parameter to look for in the HTML tags. Default to 'data-i18n'

Workflow
----------------------
The worflow you can use to make a po file driven website / web app.

* PoEditor or any other solution to edit .po files
* [po-to-json script](https://github.com/guile2912/po-to-json.git) to convert the po files to a json array that looks like :

  content_dictionary_fr = {
    "Hello": "bonjour",
    "Delete": "Suprimmer"
  }

* A client side solution to translate the HTML content. I use jquery.i18n for this.

  app.lang = 'en'; //set the lang of the app
  content_dictionary = {'fr-ca' : content_dictionary_fr, 'en' : content_dictionary_en}; //our global dictionnary var
  $.i18n.setDictionary(content_dictionary[app.lang]); //load the dictionnary
  $('[data-i18n]').each(function(idx, elt){
    var $this = $(this);
    $this.text($.i18n._($this.attr('data-i18n')));
  }); //translate all the texts on the page