const Helper = require('./helper')

helper = new Helper()
describe('Testing inventory end-points',()=>{
    it('Add a new inventory item',async()=>{
        const response = await helper.apiServer.post('/inventories')
                                        .send({
                                            "inventoryName":"apples",
                                            "inventoryDescription":"apples",
                                            "inventoryPrice":10,
                                            "inventoryQuantity" : 10000
                                        })

        expect(response.status).toBe(200)
        expect(response.body.length).toEqual(1)
    });
    it('Add a new inventory item',async()=>{
        const response = await helper.apiServer.post('/inventories')
                                        .send({
                                            "inventoryName":"oranges",
                                            "inventoryDescription":"oranges",
                                            "inventoryPrice":20,
                                            "inventoryQuantity" : 10000
                                        })

        expect(response.status).toBe(200)
        expect(response.body.length).toEqual(2)
    });
    it('Add a new inventory item',async()=>{
        const response = await helper.apiServer.post('/inventories')
                                        .send({
                                            "inventoryName":"grapes",
                                            "inventoryDescription":"grapes",
                                            "inventoryPrice":30,
                                            "inventoryQuantity" : 10000
                                        })

        expect(response.status).toBe(200)
        expect(response.body.length).toEqual(3)
    });
    it('Add a new inventory item',async()=>{
        const response = await helper.apiServer.post('/inventories')
                                        .send({
                                            "inventoryName":"cherry",
                                            "inventoryDescription":"cherry",
                                            "inventoryPrice":40,
                                            "inventoryQuantity" : 10000
                                        })

        expect(response.status).toBe(200)
        expect(response.body.length).toEqual(4)
    });
    it("GET inventory list", async () =>{
        const response = await helper.apiServer.get('/inventories')
    
        expect(response.status).toBe(200)
        expect(response.body.length).toEqual(4)
    });
    it("GET inventory item", async () =>{
        const response = await helper.apiServer.get('/inventories/1')
    
        expect(response.status).toBe(200)
        expect(response.body[0].inventory_item_name).toEqual('apples')
    });
    it("GET inventory item", async () =>{
        const response = await helper.apiServer.get('/inventories/2')
    
        expect(response.status).toBe(200)
        expect(response.body[0].inventory_item_name).toEqual('oranges')
    });
    it("Update inventory item", async () =>{
        const response = await helper.apiServer.put('/inventories/2')
                                        .send({
                                            "inventoryName":"oranges",
                                            "inventoryDescription":"oranges",
                                            "inventoryPrice":30,
                                            "inventoryQuantity" : 100000
                                        })
    
        expect(response.status).toBe(200)
    });
    it("Update inventory item", async () =>{
        const response = await helper.apiServer.put('/inventories/5')
                                        .send({
                                            "inventoryName":"oranges",
                                            "inventoryDescription":"oranges",
                                            "inventoryPrice":30,
                                            "inventoryQuantity" : 10000
                                        })
    
        expect(response.status).toBe(200)
    });
   it("Delete inventory item", async () =>{
        const response = await helper.apiServer.delete('/inventories/3')
    
        expect(response.status).toBe(200)
    });
});
describe('Testing Order end-points',()=>{
    it("GET active order list", async () =>{
        const response = await helper.apiServer.get('/orders')
    
        expect(response.status).toBe(200)
        expect(response.text).toMatch('No active item')
    });
    it("Create new order list", async () =>{
        const res = await helper.apiServer.post('/orders')
                                        .send({
                                            "customerEmail" : "abc@abc.com",
                                            "orderInventoryList" :[
                                                {
                                                    "itemName": "apples",
                                                    "quantity" : 10
                                                },
                                                {
                                                    "itemName": "cherry",
                                                    "quantity" : 5
                                                }
                                            ]
                                        
                                        })

        expect(res.status).toBe(200)
        expect(res.body.message).toMatch("Order created Successfully")

        const response = await helper.apiServer.get('/orders')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('1')
    });
    it("Create new order list", async () =>{
        const res = await helper.apiServer.post('/orders')
                                        .send({
                                            "customerEmail" : "abc@abc.com",
                                            "orderInventoryList" :[
                                                {
                                                    "itemName": "oranges",
                                                    "quantity" : 10
                                                },
                                                {
                                                    "itemName": "cherry",
                                                    "quantity" : 5
                                                }
                                            ]
                                        
                                        })
        expect(res.status).toBe(200)
        expect(res.body.message).toMatch("Order created Successfully")
        
        const response = await helper.apiServer.get('/orders')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('2')
    });
    it("GET active order list", async () =>{
        const response = await helper.apiServer.get('/orders')
    
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('2')
    });
    it("Updating the order", async ()=>{
        const res = await helper.apiServer.put('/orders/2')
                                        .send({
                                            "customerEmail" : "cfg@abc.com",
                                            "orderInventoryList" :[
                                                {
                                                    "itemName": "oranges",
                                                    "quantity" : 15
                                                },
                                                {
                                                    "itemName": "cherry",
                                                    "quantity" : 50
                                                }
                                            ]
                                        
                                        })
        expect(res.status).toBe(200)
        expect(res.text).toMatch("Order Updated!!!")
    });
    it("Delivered the order", async ()=>{
        const res = await helper.apiServer.put('/orders/2')
                                        .send({
                                            "customerEmail" : "cfg@abc.com",
                                            "orderStatus":"delivered",
                                            "orderInventoryList" :[
                                                {
                                                    "itemName": "oranges",
                                                    "quantity" : 15
                                                },
                                                {
                                                    "itemName": "cherry",
                                                    "quantity" : 50
                                                }
                                            ]
                                        
                                        })
        expect(res.status).toBe(200)
        expect(res.text).toMatch("Order delivered!!!")
    })
    it("Cancel the an active / updated order", async ()=>{
        const res = await helper.apiServer.delete('/orders/1')
                                        
        expect(res.status).toBe(200)
        expect(res.text).toMatch("Order Cancelled!!!")
    })
});
