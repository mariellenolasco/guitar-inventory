import * as express from "express";
import pgPromise from "pg-promise";

export const register = (app:express.Application) => {
    const oidc = app.locals.oidc;
    const port = parseInt(process.env.PGPORT || "5432", 10);
    const config = {
        database: process.env.PGDATABASE || "guitar-db",
        host: process.env.PGHOST || "localhost",
        port,
        user: process.env.PGUSER || "postgres"
    };

    const pgp = pgPromise();
    const db = pgp(config);

    app.get(`/api/guitars/all`, oidc.ensureAuthenticated(), async (req:any, res) => {
        try {
            const userId = req.userContext.userinfo.sub;

            const guitars = await db.any(
                `select
                    id
                    , brand
                    , model
                    , year
                    , color
                from guitars
                where user_id=$[userId]
                order by year, brand, model`, {userId}
            );
            return res.json(guitars)
        } catch (err){
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json({error: err.message || err});
        }
    });

    app.get(`/api/guitars/total`, oidc.ensureAuthenticated(), async(req:any, res) =>{
        try{
            const userId = req.userContext.userinfo.sub;
            const total = await db.one( `
                select count(*) as total
                from guitars
                where user_id=$[userId]`, {userId}, (data:{total:number}) => {
                    return {
                        total: +data.total
                    };
                }
            );
            return res.json(total);
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json({error: err.message || err});
        }
    });
    app.get(`/api/guitars/find/:search`, oidc.ensureAuthenticated(), async (req:any, res) => {
        try{
            const userId = req.userContext.userInfo.sub;
            const guitars = await db.any(`
            select
                id
                , brand
                , model
                , year
                , color
            from guitars
            where user_id = $[userId]
            and (brand ilike $[search] or model ilike $[search])`,
            {userId, search: `%${req.params.search}%`});
            return res.json(guitars);
        } catch(err){
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json({error: err.message || err});
        }
    });
    app.post(`/api/guitars/add`, oidc.ensureAuthenticated(), async(req: any, res) => {
        try{
            const userId = req.userContext.userinfo.sub;
            const id = await db.one(`
            insert into guitars (user_id, brand, model, year, color)
            values ($[userId], $[brand], $[model], $[year], $[color])
            returning id;`,
            { userId, ...req.body }
            );
            return res.json({id});
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json({error:err.message || err});
        }
    });
    app.post(`/api/guitars/update`, oidc.ensureAuthenticated(), async(req:any, res) => {
        try{
            const userId = req.userContext.userinfo.sub;
            const id = await db.one(`
            update guitars
            set brand = $[brand]
                , model = $[model]
                , year = $[year]
                , color = $[color]
            where
                id = $[id]
                and user_id = $[userId]
            returning id;
            `,
            {userId, ...req.body});
            return res.json({id});
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json({error:err.message || err});
        }
    });
    app.delete(`/api/guitars/remove/:id`, oidc.ensureAuthenticated(), async(req: any, res) =>{
        try{
            const userId = req.userContext.userinfo.sub;
            const id = await db.result(`
            delete
            from guitars
            where user_id = $[userId]
            and id = $[id]
            `, {userId, id: req.params.id}, (r) => r.rowCount);
            return res.json({id});
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json({error:err.message || err});
        }
    })
}