var cursos = [
    {
        "nome"  :   "001 - Técnico em Desenvolvimento de Sistemas",
        "sigla" :   "DS",
        "icone" :   "https://img.icons8.com/sf-black-filled/ffffff/344/source-code.png",
        "carga" :   "1200",
    },
    {
        "nome"  :   "002 - Técnico em Redes de Computadores",
        "sigla" :   "RDS",
        "icone" :   "https://img.icons8.com/wired/ffffff/344/networking-manager.png",
        "carga" :   "1200"
    }
];

const getCourses = () => {
    let courses = [];

    cursos.forEach(index => {
        courses.push(index);
    })

    return courses;
}

module.exports = {
    getCourses
}