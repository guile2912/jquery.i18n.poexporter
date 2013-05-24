/**
 * Created with JetBrains PhpStorm.
 * User: ghachet
 * Date: 14/05/13
 * Time: 11:42 AM
 * To change this template use File | Settings | File Templates.
 */
;(function ( $, window, document, undefined ) {

    // "undefined" est utilisé ici car sa variable globale est mutable en
    // ECMAScript 3, c'est-à-dire qu'elle peut être redéfinie par quelqu'un
    // d'autre. De plus, "undefined" n'est pas réélement passé à la
    // fonction, ainsi nous sommes certains que sa valeure est bien "undefined"
    // comme un "void 0". D'autre part en ES5, "undefined" n'est plus mutable.

    // "window" et "document" sont passé par des variables locales plutôt que
    // par les globales, cela accélère (relativement) le processus de résolution
    // et permet de mieux tirer avantage de la "minification" (tout
    // particulièrement quand les deux sont régulièrement référencés dans votre plugin).

    // Créons celui par défaut
    var pluginName = "i18nPoExporter",
        defaults = {
            filename: "translation.po",
            existing : {}
        };

    // Voici le constructeur du plugin
    function Plugin( element, options ) {
        this.element = element;

        // jQuery a une méthode "extend" qui fusionne les contenus d'au moins
        // deux objets, sauvegardant le résultat dans le premier. Le premier
        // objet est généralement vide, vu que nous ne souhaitons pas altérer
        // les options par défaut des futures instances du plugin.
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Mettez votre logique d'initialisation ici
            // Vous avez déjà accès à l'élément DOM et les options via l'instance,
            // par ex. : this.element et this.options

            if ($('[data-i18n]').length == 0) return;

            var self = this;
            var $link = $('<button id="create-po-file" class="btn btn-info">Create PO</button>').on( 'click', function(event){
                    self.download();
                }
            );
            $('body').append($link);
        },

        download: function() {

            var poarray = this.options.existing;
            var pofile = [];

            $('[data-i18n]').each(function(key,elt){
                var $elt = $(elt);

                poarray[$elt.attr("data-i18n")] = $elt.text();
            });

            //msgid "vinfortifie"
            //msgstr "Vin fortifié"
            for(key in poarray){
                pofile.push('msgid "'+key+'"');
                pofile.push('msgstr "'+poarray[key]+'"');
                pofile.push('');
            }

            var MIME_TYPE = 'text/plain';

            var header = 'msgid ""\n\
msgstr ""\n\
"Project-Id-Version: \\n"\n\
"POT-Creation-Date: \\n"\n\
"PO-Revision-Date: \\n"\n\
"Last-Translator: \\n"\n\
"Language-Team: \\n"\n\
"MIME-Version: 1.0\\n"\n\
"Content-Type: text/plain; charset=UTF-8\\n"\n\
"Content-Transfer-Encoding: 8bit\\n"\n\
"X-Generator: Poedit 1.5.5\\n"\n\n';

            var bb = new Blob([header + pofile.join("\r\n")], {type: MIME_TYPE});

            //create the download link
            var a = document.createElement('a');
            a.className  = 'btn btn-success';
            a.download = this.options.filename;
            a.href = window.URL.createObjectURL(bb);
            a.textContent = 'Download ready';

            a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
            a.draggable = true; // Don't really need, but good practice.
            //a.classList.add('dragout');


            $('#create-po-file').after(a);
            var self = this;

            a.onclick = function(e) {
                if ('disabled' in this.dataset) {
                    return false;
                }
                self.cleanUp(this);
            };

            // download the file
            //uriContent = "data:application/octet-stream;filename=translation.po," + encodeURIComponent(pofile.join("\r\n"));
            //newWindow=window.open(uriContent, 'NewDocument');
        },
        cleanUp: function(a) {
            a.parentElement.removeChild(a);

            //a.textContent = 'Downloaded';
            //a.dataset.disabled = true;

            // Need a small delay for the revokeObjectURL to work properly.
            setTimeout(function() {
                window.URL.revokeObjectURL(a.href);
            }, 1500);

        }
    }

    // Un très léger décorateur autour du constructeur,
    // pour en éviter de multiples instanciations.
    /*$.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };
    */
    $.fn.i18nPoExporter = function(options) {
        return new Plugin( this, options );
    }
})( jQuery, window, document );
