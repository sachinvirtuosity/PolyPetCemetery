const express = require("express");
const moment = require("moment");



// connect to a different API
// const ipfsClient = require("ipfs-http-client");
// const ipfs = ipfsClient('http://ipfs.infura.io');
const mongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;
const dotenv = require("dotenv");
dotenv.config();
const config = require("../config.js");
const MONGODB_URI = config.mongodburi;
const jverify = require("../model/JWT.js");
const constants = require("../model/constants.js");
const connection = require("../model/function.js");
var router = express.Router();
const Enum = require("enum");
const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');
const connectionURL = "https://ropsten.infura.io/v3/1f32a6562a8c4cae9f9d32c4ed179314";//"https://rinkeby.infura.io/v3/b140d24d3a5744e0b9b98848003f07fe";
const re = require('express/lib/response');
const { type } = require("express/lib/response");
const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require("constants");
var web3 = new Web3(new Web3.providers.HttpProvider(connectionURL));
Enum.register();
var database = "";



mongoClient.connect(
    MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    function (error, client) {
        if (error) {
            throw error;
        }
        database = client.db(process.env.DATABASE);
    }
);

// router.use('*',async (request, response, next) => {
//   if (!database) {
//     response.send("DB not initialized yet");
//     return;
//   }else{
//       await jverify.validateToken(request,response).then((data)=>{
//       if(!data.status){
//         response.send({msg:"Unauthenticated request",status:0});
//              return; 
//       } else {
//             next()
//           }
//         });
//   }
// })

router.get("/getCountryList", async (req, res) => {
    database && database.collection(process.env.COUNTRY_LIST)
        .find({}).sort({ countryName: 1 }).toArray(async (error, result) => {
            if (error) {
                return res.send(error);
            }
            console.log(result);
            res.send(result);
        });
});

router.get("/getGraveYardList", async (req, res) => {
    database && database.collection(process.env.GRAVEYARD_DETAILS)
        .find({}).toArray(async (error, result) => {
            if (error) {
                return res.send(error);
            }
            console.log(result);
            res.send(result);
        });
});

router.get("/getEventList", async (req, res) => {
    database && database.collection(process.env.EVENT_DETAILS)
        .find({}).toArray(async (error, result) => {
            if (error) {
                return res.send(error);
            }
            console.log(result);
            res.send(result);
        });
});

router.get("/getEventListByFilter", async (req, res) => {
    console.log(req.query,Enum);
    database && database.collection(process.env.EVENT_DETAILS)
        .find({status : req.query.status}).toArray(async (error, result) => {
            if (error) {
                return res.send(error);
            }
            console.log(result);
            res.send(result);
        });
});

router.get("/getGraveList", async (req, res) => {
    database && database.collection(process.env.GRAVE_DETAILS)
        .find({}).toArray(async (error, result) => {
            if (error) {
                return res.send(error);
            }
            console.log(result);
            res.send(result);
        });
});
//API's for tokens
router.get("/getEventDetailsbyGrave/:graveId", async (req, res) => {
    var graveId = req.params.graveId;
    console.log(graveId);
    let query = {
        graveId: graveId
    };
    await database && database.collection(process.env.EVENT_DETAILS)
        .find(query).toArray(async (error, result) => {

            console.log(result)
            if (error) {
                console.log(error);
                return res.send(error);
            }

            if (result.length > 0) {
                // result.map(data => {
                //     data.createdOn = moment(new Date(data.createdOn)).format("DD-MM-YYYY HH:mm:ss");


                // })

            }

            res.send(result);

        });

});

//API's for tokens
router.get("/getEventsbyUserAddress/:userAddress", async (req, res) => {
    var userId = req.params.userAddress;
    console.log(userId);
    let query = {
        createdBy: userId
    };
    await database && database.collection(process.env.EVENT_DETAILS)
        .find(query).toArray(async (error, result) => {

            console.log(result)
            if (error) {
                console.log(error);
                return res.send(error);
            }

            if (result.length > 0) {
                // result.map(data => {
                //     data.createdOn = moment(new Date(data.createdOn)).format("DD-MM-YYYY HH:mm:ss");


                // })

            }

            res.send(result);

        });

});

//API's for tokens
router.get("/getEventsbyUserAddressAndGrave/:userAddress/:graveId", async (req, res) => {
    var userId = req.params.userAddress;
    console.log(userId);
    let query = {
        createdBy: userId,
        graveId: req.params.graveId
    };
    await database && database.collection(process.env.EVENT_DETAILS)
        .find(query).toArray(async (error, result) => {

            console.log(result)
            if (error) {
                console.log(error);
                return res.send(error);
            }

            if (result.length > 0) {
                // result.map(data => {
                //     data.createdOn = moment(new Date(data.createdOn)).format("DD-MM-YYYY HH:mm:ss");


                // })

            }

            res.send(result);

        });

});

router.get("/getGraveByGraveYardId/:graveYardId", async (req, res) => {
    var graveId = req.params.graveYardId;
    console.log(graveId);
    let query = {
        graveYardId: graveId
    };
    await database && database.collection(process.env.GRAVE_DETAILS)
        .find(query).toArray(async (error, result) => {

            console.log(result)
            if (error) {
                console.log(error);
                return res.send(error);
            }

            if (result.length > 0) {
                // result.map(data => {
                //     data.createdOn = moment(new Date(data.createdOn)).format("DD-MM-YYYY HH:mm:ss");


                // })

            }

            res.send(result);

        });

});

router.get("/getGraveUserAddress/:userId", async (req, res) => {
    var userId = req.params.userId;
    console.log(userId);
    let query = {
        createdBy: userId
    };
    await database && database.collection(process.env.GRAVE_DETAILS)
        .find(query).toArray(async (error, result) => {

            console.log(result)
            if (error) {
                console.log(error);
                return res.send(error);
            }

            if (result.length > 0) {
                // result.map(data => {
                //     data.createdOn = moment(new Date(data.createdOn)).format("DD-MM-YYYY HH:mm:ss");


                // })

            }

            res.send(result);

        });

});

router.get("/getEventDetailsbyGraveyard/:graveYardId", async (req, res) => {
    var graveId = req.params.graveYardId;
    console.log(graveId);
    let query = {
        graveYardId: parseInt(graveId)
    };
    await database && database.collection(process.env.EVENT_DETAILS)
        .find(query).toArray(async (error, result) => {

            console.log(result)
            if (error) {
                console.log(error);
                return res.send(error);
            }

            if (result.length > 0) {
                // result.map(data => {
                //     data.createdOn = moment(new Date(data.createdOn)).format("DD-MM-YYYY HH:mm:ss");


                // })

            }

            res.send(result);

        });

});

router.post("/uploadFile", async (req, res) => {
    console.log("m hu")
    var data = req.body;
    console.log(req.body.file);
    const fileHash = "";
  //const fileHash = await addFile(data);
  res.send('https://gateway.ipfs.io/ipfs/' + fileHash);


});

const addFile = async({path,content}) => {
const file = {path:path,content: Buffer.from(content)};
const fileAdded = await ipfs.add(file);
return fileAdded[0].hash;
}


router.post("/createEvent", async (request, response) => {
    console.log(request.body);
    let alp_regex = new RegExp('[a-zA-Z]');
    switch (true) {
        case request.body.eventTime == null:
            return response.send({ msg: "Event Time Required" });
            break;
        case request.body.eventDate == null:
            return response.send({ msg: "Event Date Required" });
            break;
        case request.body.graveYardId == null:
            return response.send({ msg: "GraveYard  Required" });
            break;
        case request.body.graveId == null:
            return response.send({ msg: "Grave  Required" });
            break;


        // // case (parseInt(request.body.tokenDecimal) <= 9 || parseInt(request.body.tokenDecimal) >= 100):
        // //     return response.send({ msg: "Token Decimal Should be between 10-99" });
        // //     break;
        // case isNaN(parseInt(request.body.tokenDecimal)) == true:
        //     return response.send({ msg: "Token Decimal should contain Numbers Only" });
        //     break;
        // case isNaN(parseInt(request.body.initialSupply)) == true:
        //     return response.send({ msg: "Initial supply should contain Numbers Only" });
        //     break;
        // case (parseInt(request.body.initialSupply) <= 0):
        //     return response.send({ msg: "Initial supply Should be more than 1" });
    }

    let query = { 'tokenName': request.body.tokenName }
    var collection = database.collection(
        process.env.EVENT_DETAILS
    );
    // collection.findOne(query, async (err, result) => {
    //     if (err) {
    //         return response.send({status:2,msg:err});
    //     }
    //     if (result != null) {
    //         response.send({ status:2,msg: "Token Name Already Exists" });
    //     } else {

    let newEvent = {
        eventDate: request.body.eventDate,
        eventTime: request.body.eventTime,
        petName: request.body.petName,
        petImage: request.body.petImage,
        deathDate: request.body.deathDate,
        location: request.body.location,
        ownerName: request.body.ownerName,
        timePeriod: request.body.timePeriod,
        isPublic: request.body.isPublic,
        occuring: request.body.occuring,
        createdOn: new Date(),
        createdBy: request.body.userId,
        graveYardId: request.body.graveYardId,
        graveId: request.body.graveId,
        status : "Pending"

    };
    try {
        collection.insertOne(newEvent, async (error, result) => {
            if (error) {
                return response.send({ status: 2, msg: error });
            } else {

                msgtxt = "Event Created ";

                response.send({ status: 1, msg: msgtxt });
            }



        });
    } catch (ex) {
        response.send({ status: 1, msg: "Event Created" });
    }
    //     }
    // });

});


router.post("/cancelEvent", async (req, response) => {
    switch (true) {
        case req.body.eventId == null:
            return response.send({ msg: "Event Id Required" });
            break;
    


        // // case (parseInt(request.body.tokenDecimal) <= 9 || parseInt(request.body.tokenDecimal) >= 100):
        // //     return response.send({ msg: "Token Decimal Should be between 10-99" });
        // //     break;
        // case isNaN(parseInt(request.body.tokenDecimal)) == true:
        //     return response.send({ msg: "Token Decimal should contain Numbers Only" });
        //     break;
        // case isNaN(parseInt(request.body.initialSupply)) == true:
        //     return response.send({ msg: "Initial supply should contain Numbers Only" });
        //     break;
        // case (parseInt(request.body.initialSupply) <= 0):
        //     return response.send({ msg: "Initial supply Should be more than 1" });
    }
    try {

    let query = {
        "_id": new ObjectId(req.body.eventId)
    };
console.log(query)
    var collection = database.collection(
        process.env.EVENT_DETAILS
    );
    await database && database.collection(process.env.EVENT_DETAILS)
        .findOne(query,async (error, result) => {

            console.log(result)
            if (error) {
                console.log(error);
                return res.send(error);
            }

            if (result != null ) {
                // result.map(data => {
                //     data.createdOn = moment(new Date(data.createdOn)).format("DD-MM-YYYY HH:mm:ss");


                // })
                result.status = "Cancelled";
                var newvalues = { $set: {status: "Cancelled",
                 modifyAt: new Date() } };
                collection.updateOne(query,newvalues, async (error, result) => {
                    if (error) {
                        return response.send({ status: 2, msg: error });
                    } else {
        
                        msgtxt = "Event Updated ";
        
                        response.send({ status: 1, msg: msgtxt });
                    }

            });


        }
        else{
            response.send({ status: 404, msg: "Event Not Found" });

        }

    });

  
    
     
    } catch (ex) {
        console.log(ex)
        response.send({ status: 1, msg: "Event Created" });
    }
    //     }
    // });

});

router.post("/createGrave", async (request, response) => {
    console.log(request.body);
    switch (true) {
        case request.body.location == null:
            return response.send({ msg: "Location Required" });
            break;
        case request.body.petName == null:
            return response.send({ msg: "Name Required" });
            break;
        case request.body.graveYardId == null:
            return response.send({ msg: "GraveYard  Required" });
            break;
 


        // // case (parseInt(request.body.tokenDecimal) <= 9 || parseInt(request.body.tokenDecimal) >= 100):
        // //     return response.send({ msg: "Token Decimal Should be between 10-99" });
        // //     break;
        // case isNaN(parseInt(request.body.tokenDecimal)) == true:
        //     return response.send({ msg: "Token Decimal should contain Numbers Only" });
        //     break;
        // case isNaN(parseInt(request.body.initialSupply)) == true:
        //     return response.send({ msg: "Initial supply should contain Numbers Only" });
        //     break;
        // case (parseInt(request.body.initialSupply) <= 0):
        //     return response.send({ msg: "Initial supply Should be more than 1" });
    }

    var collection = database.collection(
        process.env.GRAVE_DETAILS
    );
    // collection.findOne(query, async (err, result) => {
    //     if (err) {
    //         return response.send({status:2,msg:err});
    //     }
    //     if (result != null) {
    //         response.send({ status:2,msg: "Token Name Already Exists" });
    //     } else {

    let newEvent = {
        petName: request.body.petName,
        title : request.body.title,
        description : request.body.description,
        petImage: request.body.petImage,
        deathDate: request.body.deathDate,
        location: request.body.location,
        ownerName: request.body.ownerName,
        createdOn: new Date(),
        createdBy: request.body.userId,
        graveYardId: request.body.graveYardId
    };
    try {
        collection.insertOne(newEvent, async (error, result) => {
            if (error) {
                return response.send({ status: 2, msg: error });
            } else {

                msgtxt = "Grave Created ";

                response.send({ status: 1, msg: msgtxt });
            }



        });
    } catch (ex) {
        response.send({ status: 1, msg: "Event Created" });
    }
    //     }
    // });

});

router.post("/createGraveYard", async (request, response) => {
    console.log(request.body);
    let alp_regex = new RegExp('[a-zA-Z]');
    switch (true) {
        case request.body.name == null:
            return response.send({ msg: "Name Required" });
            break;
        case request.body.location == null:
            return response.send({ msg: "Location Required" });
            break;


        // // case (parseInt(request.body.tokenDecimal) <= 9 || parseInt(request.body.tokenDecimal) >= 100):
        // //     return response.send({ msg: "Token Decimal Should be between 10-99" });
        // //     break;
        // case isNaN(parseInt(request.body.tokenDecimal)) == true:
        //     return response.send({ msg: "Token Decimal should contain Numbers Only" });
        //     break;
        // case isNaN(parseInt(request.body.initialSupply)) == true:
        //     return response.send({ msg: "Initial supply should contain Numbers Only" });
        //     break;
        // case (parseInt(request.body.initialSupply) <= 0):
        //     return response.send({ msg: "Initial supply Should be more than 1" });
    }

    var collection = database.collection(
        process.env.GRAVEYARD_DETAILS
    );
    // collection.findOne(query, async (err, result) => {
    //     if (err) {
    //         return response.send({status:2,msg:err});
    //     }
    //     if (result != null) {
    //         response.send({ status:2,msg: "Token Name Already Exists" });
    //     } else {

    let newGraveYard = {
        location: request.body.location,
        quantity: request.body.quantity,
        name: request.body.name,
        yardImage: request.body.yardImage,
        createdOn: new Date(),
        createdBy: request.body.userId
    };
    try {
        collection.insertOne(newGraveYard, async (error, result) => {
            if (error) {
                return response.send({ status: 2, msg: error });
            } else {

                msgtxt = "GraveYard Created ";

                response.send({ status: 1, msg: msgtxt });
            }



        });
    } catch (ex) {
        response.send({ status: 1, msg: "Event Created" });
    }
    //     }
    // });

});
//API's for SubscriptionFee
router.get("/getSubscriptionFee/:contract/:network", async (req, res) => {
    let query = {
        contractType: constants.tokenTypeList.get(req.params.contract).value,
        network: constants.networkList.get(req.params.network).value,

    };
    database && database.collection(process.env.SUBSCRIPTION_FEE)
        .find(query).toArray(async (error, result) => {
            if (error) {
                return res.send(error);
            }
            result.map(data => {
                data.contractType = constants.contractTp.get(data.contractType).key;
                data.network = constants.networkList.get(req.params.network).key
            });
            res.send(result);
        });
});
router.get("/getTokenDetailsbyId/:tokenId", async (req, res) => {
    var tokenId = req.params.tokenId;
    database && database.collection(process.env.TOKEN_DETAILS)
        // .find({ '_id': new ObjectId(tokenId) })
        .aggregate([

            {
                $match: {
                    _id: new ObjectId(tokenId)
                }
            },
            {
                $addFields: {
                    subscriptionFee: {
                        $toObjectId: "$subscriptionFee"
                    }
                }
            },

            {
                $lookup: {
                    from: process.env.SUBSCRIPTION_FEE,
                    localField: "subscriptionFee",
                    foreignField: "_id",
                    as: "subscriptionFees"
                }
            }
        ])
        .toArray(async (error, result) => {
            if (error) {
                return res.send(error);
            }
            result.map(data => {
                data.supplyType = constants.supplyTypeList.get(data.supplyType).key;
                data.accessType = constants.supplyTypeList.get(data.accessType).key;
                data.transferType = constants.transferTypeList.get(data.transferType).key;
                data.tokenType = constants.tokenTypeList.get(data.tokenType).key;
                data.network = constants.networkList.get(data.network).key;
                data.isMetamask = data.isMetamask ? 'Metamask' : "-";

            })
            res.send(result);
        });

});
router.post("/addBillingDetails/", async (req, res) => {
    var data = request.body;

    let billingDtls = {
        walletAddress: data.walletAddress,
        legalName: data.legalName,
        emailid: data.emailid,
        billingAddress: data.billingAddress,
        zipCode: data.zipCode,
        city: data.city,
        state: data.state,
        country: data.country,
        taxId: data.taxId,
        taxRegNumber: data.taxRegNumber,
        userId: data.userName,
        tokenId: data.tokenId,
        createdBy: data.userId,
        createdOn: new Date()
    };
    var collection = database.collection(
        process.env.BILLING_DETAILS
    );

    try {
        collection.insertOne(billingDtls, async (error, result) => {
            if (error) {
                return response.send({ status: 2, msg: error });
            } else {

            }

        });
    } catch (ex) {
        response.send({ status: 1, msg: "Token Created" });
    }


});
router.get("/getContractValues", async (req, res) => {
    let tokenName = req.params.tokenName;
    let tokenSymbol = req.params.tokenSymbol;
    try {
        /**
         * COMPILATION SCRIPT
         */
        const source = fs.readFileSync('./model/AlphaToken.sol', 'UTF-8');

        var input = {
            language: 'Solidity',
            sources: {
                'AlphaToken.sol': {
                    content: source,
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*']
                    }
                }
            }
        };

        var output = JSON.parse(solc.compile(JSON.stringify(input)));

        // `output` here contains the JSON output as specified in the documentation
        for (var contractName in output.contracts['AlphaToken.sol']) {
            // console.log(
            contractName +
                ': ' +
                output.contracts['AlphaToken.sol'][contractName].evm.bytecode.object
            // );
        }


        /**
         * DEPLOYMENT SCRIPT
         */
        res.send({
            "byteCode": output.contracts['AlphaToken.sol'][contractName].evm.bytecode.object,

            "contractABI": output.contracts['AlphaToken.sol'][contractName].abi
        })
    } catch (ex) {

    }

});
const deploy = async (tokenName, tokenSymbol) => {
    var returnData = {};
    try {
        /**
         * COMPILATION SCRIPT
         */
        const source = fs.readFileSync('./model/AlphaToken.sol', 'UTF-8');

        var input = {
            language: 'Solidity',
            sources: {
                'AlphaToken.sol': {
                    content: source,
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*']
                    }
                }
            }
        };

        var output = JSON.parse(solc.compile(JSON.stringify(input)));

        // `output` here contains the JSON output as specified in the documentation
        for (var contractName in output.contracts['AlphaToken.sol']) {
            // console.log(
            contractName +
                ': ' +
                output.contracts['AlphaToken.sol'][contractName].evm.bytecode.object
            // );
        }


        /**
         * DEPLOYMENT SCRIPT
         */
        const byteCode = output.contracts['AlphaToken.sol'][contractName].evm.bytecode.object;
        console.log("bytecode", byteCode);
        const contractABI = output.contracts['AlphaToken.sol'][contractName].abi;

        const incrementer = new web3.eth.Contract(contractABI);
        const incrementerTx = incrementer.deploy({
            data: byteCode,
            arguments: [tokenName, tokenSymbol]
        });
        const createTransaction = await web3.eth.accounts.signTransaction(
            {
                from: process.env.ADDRESS_WEB3,
                data: incrementerTx.encodeABI(),
                gas: '3000000',
            },
            process.env.PRIVATE_KEY_WEB3
        );
        const createReceipt = await web3.eth.sendSignedTransaction(
            createTransaction.rawTransaction
        );
        console.log(createReceipt);
        returnData = { "data": createReceipt, "error": null };
    } catch (ex) {

        returnData = { "data": null, "error": ex };

    } finally {
        return returnData;
    }
};
const addBillingDetails = async (data, billingDtl) => {

    let billingDtls = {
        walletAddress: data.walletAddress,
        legalName: data.legalName,
        emailid: data.emailid,
        billingAddress: data.billingAddress,
        zipCode: data.zipCode,
        city: data.city,
        state: data.state,
        country: data.countryName,
        taxId: data.taxId,
        taxRegNumber: data.taxRegNumber,
        userId: billingDtl.userId,
        tokenId: billingDtl.tokenId,
        createdBy: billingDtl.createdBy,
        createdOn: new Date(),
        contractAddress: billingDtl.contractAddress
    };
    var collection = database.collection(
        process.env.BILLING_DETAILS
    );

    try {
        collection.insertOne(billingDtls, async (error, result) => {
            if (error) {
                return ({ status: 2, msg: error });
            } else {
                return (result);
            }

        });
    } catch (ex) {
        return ({ status: 1, msg: "Token Created" });
    }


}
// const deploy = async () => {
//     var returnData={};
//     try {
//         const source = fs.readFileSync("./model/test.sol", 'UTF-8');

//         var input = {
//             language: 'Solidity',
//             sources: {
//                 'test.sol': {
//                     content: source,
//                     //content: 'contract C { function f() public { } }'
//                 },
//             },
//             settings: {
//                 outputSelection: {
//                     '*': {
//                         '*': ['*']
//                     }
//                 }
//             }
//         };

//         var output = JSON.parse(solc.compile(JSON.stringify(input)));
//         console.log(output);

//         // `output` here contains the JSON output as specified in the documentation
//         for (var contractName in output.contracts['test.sol']) {
//             ////console.log(
//                 contractName +
//                 ': ' +
//                 output.contracts['test.sol'][contractName].evm.bytecode.object
//           //  );
//         }

//         const byteCode = output.contracts['test.sol'][contractName].evm.bytecode.object;

//         const contractABI = output.contracts['test.sol'][contractName].abi;
//         const incrementer = new web3.eth.Contract(contractABI);
//         const incrementerTx = incrementer.deploy({
//             data: byteCode,
//             arguments: [5, re],
//         });

//         const createTransaction = await web3.eth.accounts.signTransaction(
//             {
//                 from: process.env.ADDRESS_WEB3,
//                 data: incrementerTx.encodeABI(),
//                 gas:3000000,
//             },
//             process.env.PRIVATE_KEY_WEB3
//         );
//         const createReceipt = await web3.eth.sendSignedTransaction(
//             createTransaction.rawTransaction
//         );
//         returnData= {"data":createReceipt,"error":null};
//     } catch (ex) {

//         returnData= {"data":null,"error":ex};

//     } finally{
//         return returnData;
//     }
// };

module.exports = router;