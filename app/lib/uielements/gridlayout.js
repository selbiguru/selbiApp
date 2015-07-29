exports.GridLayout = function(row, col, padding,obj){
    var vview = Ti.UI.createView({
        height: 'auto',
        width: 'auto',
        layout: "vertical"
    });
    var tmp=0;
    for(var x = 0; x < row ; x++){
        var hview = Ti.UI.createView({
            height: "auto",
            width: "auto",
            layout: "horizontal"
        });
        for(var y = 0; y < col; y++){
            obj[tmp].top = padding;
            obj[tmp].left = padding;
            hview.add(obj[tmp]);
            tmp++;
        }
        vview.add(hview);
    }
    return vview;
};