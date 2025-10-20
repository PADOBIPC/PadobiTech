export default function getCurrentPageName(){
    const name = location.pathname.split("/").pop();
    return name;
};