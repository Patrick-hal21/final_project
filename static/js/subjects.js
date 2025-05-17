// from https://be.moeedu.org/search/index.php

export const typesAndSubjects = 
                {"Primary" :
                ["Myanmar", "English", "Mathematics", "Moral & Civics", "Life Skills"],

                "Secondary" :
                ["Myanmar", "English", "Mathematics", "Science", "Geography", "History"],

                "Tertiary-1" :
                ["Myanmar", "English", "Mathematics", "Physics", "Chemistry", "Biology"],

                "Tertiary-2" :
                ["Myanmar", "English", "Mathematics", "Physics", "Chemistry", "Ecology"],

                "Tertiary-3" :
                ["Myanmar", "English", "Mathematics", "Geography", "History", "Ecology"]
}

// retrieve from the database
export const classCate = ["Class-A", "Class-B", "Class-C"];

export function getSubjects(key) {
    return typesAndSubjects[key];
}

// const subjectsJSON = JSON.stringify(subjects);
// console.log(subjectsJSON);
