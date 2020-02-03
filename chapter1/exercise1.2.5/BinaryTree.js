class Noeud {
    constructor(val) {
        this.valeur = val;
        this.gauche = undefined;
        this.droite = undefined;
        this.parent = undefined;
    }
    
    // Affiche la valeur du noeud et la valeur de ses deux enfants et de son parent
    toString() {
        var out = "Noeud " + this.valeur + ":  L";
        
        this.gauche === undefined ? out += "-" : out += this.gauche.valeur;
        out += " R";
        
        this.droite === undefined ? out += "-" : out += this.droite.valeur;
        out += " P";
        
        this.parent === undefined ? out += "-" : out += this.parent.valeur;
        console.log(out);
    }
}
class Arbre {
    constructor() {
        this.racine = undefined;
    }

    _trouverNoeud(valeur, noeud){
        if (noeud === undefined)
            return undefined;
        else if (noeud.valeur === valeur)
            return noeud;
        else {
            if (valeur < noeud.valeur)
                return this._trouverNoeud(valeur, noeud.gauche);
            else
                return this._trouverNoeud(valeur, noeud.droite);
        }
    }
    
    //Méthode pour trouver une valeur donnée dans un arbre binaire de recherche
    trouverNoeud(valeur) {
        return this._trouverNoeud(valeur, this.racine);
    }
    
    //Méthode pour ajouter un noeud
    ajouterNoeud(valeur) {
        if (this.racine === undefined) {
            this.racine = new Noeud(valeur);
        }
        else
            this._ajouterNoeud(valeur, this.racine);
    }

    _ajouterNoeud(valeur, noeud) {
        if (valeur < noeud.valeur){
            if (noeud.gauche === undefined){
                noeud.gauche = new Noeud(valeur);
                noeud.gauche.parent = noeud;
            }
            else 
                this._ajouterNoeud(valeur, noeud.gauche);
        }
        else {
            if (noeud.droite === undefined) {
                noeud.droite = new Noeud(valeur);
                noeud.droite.parent = noeud;
            }
            else
                this._ajouterNoeud(valeur, noeud.droite);
        }
    }
    
    //Méthode pour supprimer un noeud
    supprimerNoeud(valeur) {
        let noeud = this.trouverNoeud(valeur);
        if (noeud !== undefined){
            /* Test if node is a leaf */
            if ((noeud.gauche === undefined) && (noeud.droite === undefined)){
                if (noeud.parent.gauche === noeud)
                    noeud.parent.gauche = undefined;
                else
                    noeud.parent.droite = undefined;
            }
            else if (noeud.gauche === undefined){
                if (noeud.valeur < noeud.parent.valeur) {
                    noeud.parent.gauche = noeud.droite;
                    noeud.droite.parent = noeud.parent;
                }
                else {
                    noeud.parent.droite = noeud.droite;
                    noeud.droite.parent = noeud.parent;
                }
            }
            else if (noeud.droite === undefined){
                if (noeud.valeur < noeud.parent.valeur) {
                    noeud.parent.gauche = noeud.gauche;
                    noeud.gauche.parent = noeud.parent;
                }
                else {
                    noeud.parent.droite = noeud.gauche;
                    noeud.gauche.parent = noeud.parent;
                }
            }
            else {
                /* find inorder predecessor */
                let inorderPreNode = noeud.gauche;
                while (inorderPreNode.droite !== undefined)
                    inorderPreNode = inorderPreNode.droite;
                /* find inorder successor */
                let inorderPostNode = noeud.droite;
                while (inorderPostNode.gauche !== undefined)
                    inorderPostNode = inorderPostNode.gauche;

                let deltaPreNode = noeud.valeur - inorderPreNode.valeur;
                let deltaPostNode = inorderPostNode.valeur - noeud.valeur;
                let val = 0;
                if (deltaPreNode < deltaPostNode){
                    val = inorderPreNode.valeur;
                    this.supprimerNoeud(inorderPreNode.valeur);
                }
                else
                {
                    val = inorderPostNode.valeur;
                    this.supprimerNoeud(inorderPostNode.valeur);
                }
                noeud.valeur = val;
            }
        }
    }

    _infixe(array, noeud){
        if (noeud.gauche !== undefined)
            array = this._infixe(array, noeud.gauche);
        array.push(noeud.valeur);
        if (noeud.droite != undefined)
            array = this._infixe(array, noeud.droite);
        return array;
    }
    
    //Méthode pour afficher l’arbre selon un parcours infixe
    //Cette méthode doit retourner un tableau contenant la valeur des noeuds
    infixe() {
        let tab = [];
        if (this.racine != undefined)
            this._infixe(tab, this.racine);
        return tab;
    }
    
    //Méthode pour afficher la valeur d'un noeud à partir de sa valeur
    printNoeud (valeur) {
        let noeud = this.trouverNoeud(valeur);
        if (noeud !== undefined) noeud.toString();
    }
}

let a = new Arbre();
a.ajouterNoeud(30);
a.ajouterNoeud(18);
a.ajouterNoeud(24);
a.ajouterNoeud(11);
a.ajouterNoeud(33);
a.ajouterNoeud(13);
a.ajouterNoeud(40);
a.ajouterNoeud(46);
a.ajouterNoeud(14);
a.ajouterNoeud(21);
a.ajouterNoeud(12);
a.ajouterNoeud(10);
a.ajouterNoeud(31);
a.ajouterNoeud(35);
a.ajouterNoeud(32);

/*let noeud;
noeud = a.trouverNoeud(13);
if (noeud != undefined)
    noeud.toString();
else
    console.log("Not found !");*/

a.supprimerNoeud(null);
console.log(a.infixe());