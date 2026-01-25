import http from "../http/http";



export const UpdateTemplate = async (template) => {
    try{
        const res = await http.put(`/production/templates`, template);
        if(res.data.success){
            return true;
        }
        return false;
    }
    catch(err){
        return false;
    }
}