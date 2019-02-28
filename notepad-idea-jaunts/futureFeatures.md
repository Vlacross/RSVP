


mention made of referencing an array?


"isLoggedIn and isAdmin middleware"
create middleware for two levels
    
_________________
        __|_
        __|__MastAdmin[read and write all]
        __|__EventAdmin[ read and write all Posts and Comments; Read all users ]
        __|__User[ Read and write Comments; read Posts and users;  ]








    _|_     _|_      _|_Create
    _|_     _|_      _|_Read
    _|_     _|_      _|_Update
    _|_     _|_      _|_Delete
    _|_     _|_      _|_
    U      C        P   

----------------------------------------------------------------------------------
**********************************************************************************
Suggested user Roles Flow for using App

enter-OPTIONS
        -log in with username-password-eventName
            -authCheckw/ passport (user exists and pwd is correct)
            -auth check custom middlware for EventData(userId exists in specified event)
            -(apply role to stored user info for mongoose-layer auth)

        -register with full-user-pass-event(supposing invited)
            -must be an existing event

        -Create event----(create event collection )
                new schema({
                    event name: String,
                    host: String,  ---(masterAdmin)
                    dateOfEvent: (calendar selector?),
                    location: String,
                    contactInfo: String,
                    attendees: [type: ObjectId, ref: 'users']

                })

            -On create, will ask event creator to fill in full, user, and password for host info
                Then will create user account AFTER creating event, to attach eventID to user account and assign MasterAdmin priv

                -userSchema
                            {
                    isAdmin: Boolean,
                    role: { Integer, Default: 2 } 
                    }

    -Would need to add "event" to ALL other schemas to validate data belongs with set
    -would then validate existance of userId in event "attendees" array  
    -pre-set roles for routes so event creator can enable admin privlidges to certain users
        -middleware to implement for pre-set routes depending on level of access allowed
        -(checkbox option in schema and add's few extra features on client side) 


----------------------------------------------------------------------------------
middleware: 
    Level-0  masterAdmin [read and write all]
    Level-1  EventAdmin: [ read and write all Posts and Comments; Read all users ]
    Level-2  User: [ Read and write Comments; read Posts and users; 
        Posts: 
            -get=2
            -post=1
            -update=1
            -delete=1
        Comments: 
            -get=2
            -post=2
            -update=1
            -delete=1
        Users: 
            -get=2
            -post=1
            -update=0
            -delete=0

    Though unspecified: current users will have access to update their own accoutn details; Also delete for their own comments and account.

----------------------------------------------------------------------------------

Master Admin is assigned upon creation of event 
    can later submit userList form with role edit(and apply eventAdmin role to certain users)


**********************************************************************************
----------------------------------------------------------------------------------
How to allow Users to control their own content when write permissions restricted on mongoose Layer:q
    -for when the item is a post or comment the user wants to remove
    -match item id with user id on client side to send a pass property in the header
        -adjust middleware to allow pass


----------------------------------------------------------------------------------
**********************************************************************************




