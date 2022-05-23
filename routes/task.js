const router = require("express").Router();
const task = require("../models/task");
const list = require("../models/list");
const auth = require("./auth");

const { verifyToken } = require("../validation");
const NodeCache = require("node-cache");
const app = require("../server");
//stdTTL 
const cache = new NodeCache({ stdTTL: 600 });


// CRUD operations

// Create task (post)
router.post("/", (req, res) => {
    data = req.body;

    task.insertMany(data)
        .then(data => {
            res.status(201).send(data);
            console.log(data[0]._id.toString());
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
});

// Read all tasks (get)
router.get("/", async (req, res) => {

    try {
        //try to get data from cache
        let taskCache = cache.get('allTasks');

        // if data does not excist in cache, retrieve it rom DB
        if (!taskCache) {
            let data = await task.find();

            console.log("No cache data found, Fetching from DB...");
            const timeToLiveSecs = 10;
            cache.set('allTask', data, 30);

            res.send(mapArray(data));
        }
        else {
            console.log("Cache found: ");
            res.send(mapArray(taskCache));
        }
    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
      task.find()
          .then(data => {
  
              res.send(mapArray(data));
          })
          .catch(err => {
              res.status(500).send({ message: err.message })
          })

});

//Additional routes
//Query all tasks based on status
router.get("/_listId/:id", (req, res) => {
    task.find({ _listId: req.params.id })
        .then(data => {
            res.send(mapArray(data));
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
});


/*
router.get("/price/:operator/:price", (req, res) => {

    const operator = req.params.operator;
    const price = req.params.price;

    let filterExpr = { $lte: req.params.price };

    if (operator == "gt") {
        filterExpr = { $gte: req.params.price };
    }

    task.find({ price: filterExpr })
        .then(data => { res.send(data) })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
});


*/
//Read specific task based on id (get)
router.get("/:id", (req, res) => {
    task.findById(req.params.id)
        .then(data => { res.send(data) })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })


});

// Update specific task (put)
router.put("/:id",  (req, res) => {

    const id = req.params.id;
    task.findByIdAndUpdate(id, req.body)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Cannot update task with id=" + id + ". Maybe the task was not found!" });
            }
            else {
                res.send({ message: "task was successfully updated." });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating task with id=" + id })
        })
});

// Delete specific task (delete)
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    task.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Cannot delete task with id=" + id + ". Maybe the task was not found!" });
            }
            else {
                res.send({ message: "task was successfully deleted." });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error deleting task with id=" + id })
        })
});
/**
 * POST /lists/:listId/tasks
 * Purpose: Create a new task in a specific list
 */
 router.post('/:listId/tasks', (req, res) => {
    // We want to create a new task in a list specified by listId

    list.findOne({
        _id: req.params.listId,
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can create new tasks
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canCreateTask) => {
        if (canCreateTask) {
            let newTask = new task({
                title: req.body.title,
                _listId: req.params.listId
            });
            newTask.save().then((newTaskDoc) => {
                res.send(newTaskDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })
})



function mapArray(arr) {

    let outputArr = arr.map(element => (
        {
            id: element._id,
            title: element.title, 
            description: element.description,
            priority: element.priority,
            deadline: element.deadline,
            _listId: element._listId,
            _userId: element._userId,
            date: element.date,
            uri: "/api/tasks/" + element.list,
        }
    ));

    return outputArr;
}
module.exports = router;