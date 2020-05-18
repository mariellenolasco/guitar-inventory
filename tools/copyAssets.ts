import * as shell from "shelljs";
//copy all the view templates
shell.cp("-R", "src/views", "dist/")