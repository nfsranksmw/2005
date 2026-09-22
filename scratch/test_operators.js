var fso = new ActiveXObject("Scripting.FileSystemObject");
var file = fso.OpenTextFile("assets/js/operator-icons.js", 1);
var code = file.ReadAll();
file.Close();

var window = {};
var localStorage = {
    _data: {},
    getItem: function(k) { return this._data[k] || null; },
    setItem: function(k, v) { this._data[k] = v; },
    removeItem: function(k) { delete this._data[k]; }
};

// Polyfill Set and Map for JScript if needed, or check if Map exists
try {
    eval(code);
} catch(e) {
    WScript.Echo("Eval note: " + e.message);
}
WScript.Echo("Finished JScript check");
