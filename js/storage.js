var storage = {
    put : function(key, value){
        localStorage.setItem(key,JSON.stringify(value));
    },
    get : function(key){
        return $.parseJSON(localStorage.getItem(key));
    }
};
