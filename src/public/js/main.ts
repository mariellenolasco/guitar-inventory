import axios from "axios";
import * as M from "materialize-css";
import Vue from "vue";
//tslint:disable-next-line no-unused-expression
new Vue({
    computed:{
        hazGuitars():boolean{
            return this.isLoading === false && this.guitars.length > 0;
        },
        noGuitars(): boolean {
            return this.isLoading === false && this.guitars.length === 0;
        }
    },
    data() {
        return {
            brand: "",
            color: "",
            guitars: [],
            isLoading: true,
            model: "",
            selectedGuitar: "",
            selectedGuitarId: 0,
            year: ""
        };
    },
    el: "#app",
    methods: {
        addGuitar(){
            const guitar = {
                brand: this.brand,
                color: this.color,
                model: this.model,
                year: this.year
            };
            axios
                .post("/api/guitars/add", guitar)
                .then( () => {
                    this.$refs.year.focus();
                    this.brand = "";
                    this.color = "";
                    this.model = "";
                    this.year = "";
                    this.loadGuitars();
                })
                .catch((err:any) => {
                    //tslint:disable-next-line:no-console
                    console.log(err);
                });
        },
        confirmDeleteGuitar(id : string){
            const guitar = this.guitars.find
        }
    }
})