//#1. load required lib
const hbs = require('express-handlebars')
const express = require('express')
const mysql = require('mysql')
const config = require('./config.json');

//#7 SQL statements
const SQL_SELECT_EMPLOYEE = "select * from employeesabc limit ? offset ?";



//#2. configure PORT
const PORT = parseInt(process.argv[2] || process.env.APP_PORT || 3000);

//#3. create an instance of the application
const app = express();

//#4. set up employees app (No need if you just have one database in config.json )
const empPool = mysql.createPool(config.employees)

//#5. configure handlebars
app.engine('hbs', hbs())
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views');

//#8. get employees request
app.get('/employees123', (req, resp)=>{ // '/employees123' refers to path of the new page where your result page is displayed
    const limit = parseInt(req.query.limit) || 10;
    //const limit =10;
    const offset = parseInt(req.query.offset) || 0;
    //const offset =0; // for basicSQL only
    empPool.getConnection((err, conn)=>{ //get connection for employees database
        console.error('Error: ', err)
        conn.query(SQL_SELECT_EMPLOYEE, [ limit, offset ],//query request
            (err, result) => {
                conn.release();
                console.error('Error: ', err);
                console.log(result);
                resp.format({
                    'text/html': () => {
                            resp.status(200);
                            resp.type('text/html');
                            resp.render('employees',{ //render to employees.hbs
                                employees: result, 
                                //cater for pagination
                                next_offset: (offset + limit), 
                                prev_offset: (offset - limit), //beware of conrner cases
                                layout: false}
                                )
                            //resp.send(result)
                            },
                            'application/json': () => {
                                let empUrls = result
                                        //.filter(r => (r.emp_no % 2) == 0)
                                        .map(r => `/employee/${r.emp_no}`)
                                //for (let r of result) 
                                    //empUrls.push(`/employee/${r.emp_no}`);
                                resp.status(200);
                                resp.type('application/json')
                                resp.json(empUrls);
                            },
                            'default': () => { resp.status(417).end(); }

                        });
                    }
                )               
            }
        );
    })

//Misc. Just to provide a path for health check
app.get('/healthz', (req, resp) => {
    resp.status(200).end();
})

//#6a. check connectivity of database to ensure 3306 is up before setting up server
empPool.getConnection((err, conn) => { 
    if (err) {  // ensure pool is connected correctly
        console.error('Error: ', err);
        process.exit(-1);
        return;
    }
    console.info('Pinging database...')
    conn.ping(err => {
        conn.release();
        if (err) {
            console.error('Cannot ping database: ', err);
            process.exit(-1);
            return;
        }
        //#6b. set up server if connected correctly
        app.listen(PORT, () => {
            console.info('Application started at %s on port %d',
                new Date(), PORT);
        });
    })
})