const express= require('express');
const bodyParser= require('body-parser')
const app= express();
// const date= require(__dirname+"/date.js")
const lodash= require('lodash');
const mongoose= require("mongoose");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); 

app.get('/about', function(req, res){
    res.render('about');
})
//mongoose
main().catch(err => console.log(err));
async function main(){
    mongoose.connect('mongodb://127.0.0.1:27017/todoListDB');
    const itemsSchema= new mongoose.Schema({
        name: String
    });
    const itemM= mongoose.model("itemM", itemsSchema);
    // default items eat, game sleep
    const eat= new itemM({name: "Welcome to your ToDo List!"});
    const game= new itemM({name: "Hit the + to add a new Item."});
    const sleep= new itemM({name: "<-- Hit this to delete and Item."});
    var defaultItem= [eat, game, sleep];

    //new schema for custom list
    const listSchema= new mongoose.Schema({
        name: String,
        items: [itemsSchema]
    })

    const List= mongoose.model("List", listSchema);



app.get('/', function(req, res){
    // day= date();
    main().catch(function(err){ console.log(err)})
    var items;
    async function main(){
         items= await itemM.find();
        if(items.length==0){
            await itemM.insertMany(defaultItem);
            items= await itemM.find();
        }
        res.render('list', {ListTitle: "Today", newListItems: items});
    }
})


app.post('/' ,function(req, res){
    const ListTitle= req.body.list
    main().catch(err => console.log(err));
    async function main(){
        const nItem= new itemM({name: req.body.toDoNext})
        if(ListTitle=="Today"){
            await nItem.save();
            res.redirect("/");
        }
        else{
            var customlst= await List.findOne({name: ListTitle});
            customlst.items.push(nItem);
            await customlst.save();
            res.redirect("/"+ListTitle);
        }
    }

})
app.post('/delete', async function(req,res){
    const id= req.body.checkbox;
    const listName= req.body.ListName;
    if(listName=='Today'){
        await itemM.deleteOne({_id: id});
        res.redirect('/');
    }else{
        var customlst= await List.findOneAndUpdate({name: listName},{$pull:{items: {_id: id}}} , {
            new: true
          });
        // finding the list using findOneAndUpdate using listName and removing the object from items array with id using the $pull   
        res.redirect("/"+listName);
    }
})


app.get('/:ListName', async function(req, res){
    const customListName= lodash.capitalize(req.params.ListName);
    var ListObj= await List.findOne({name: customListName});
    if(ListObj){
        res.render('list', {ListTitle: ListObj.name, newListItems: ListObj.items});
    }else{
        var nList= new List({
            name: customListName,
            items: defaultItem
        })
        await nList.save()
        res.redirect('/'+customListName);
    }
})



}
app.listen(3000, function(){
console.log('Server Running');
})