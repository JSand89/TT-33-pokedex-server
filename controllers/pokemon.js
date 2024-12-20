const Pokemon= require("../models/pokemon");
const {fetchPokemon} = require("../services/fetch")
exports.test = (req,res)=>{
    console.log("routes pokemon ok");
    res.send("controller pokemon ok").status(200);
}
exports.createPokemon = async (req,res)=>{
    try {
        const pokemonStatus = await Pokemon.create({
            pokemon_id: req.body.pokemon_id,
            view: req.body.view,
            catch: req.body.catch,
            in_team: req.body.in_team
        })
        res.json(pokemonStatus).status(201);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error});
    }
}
exports.getPokemons = async (req,res)=>{
    try {
        const pokemons = await Pokemon.find({});
        res.status(200).json(pokemons);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error});
    }
}
exports.getPokemonByPokemonId = async (req,res)=>{
    try {
        const pokemon_id = req.params.pokemon_id;
        const pokemon = await Pokemon.findOne({"pokemon_id":pokemon_id});
        const pokemonData = await fetchPokemon(pokemon_id,pokemon)
        res.status(200).json(pokemonData)
    } catch (error) {
        console.error(error);
        return res.status(500).json({error});  
    }
}
exports.catchPokemonByPokemonId = async (req,res)=>{
    try {
        const pokemon_id = req.params.pokemon_id;
        let pokemon = await Pokemon.findOne({"pokemon_id":pokemon_id})
        if(!pokemon){
            return res.status(404).json({message:"Pokemon not view yet"})
        }
        else if(pokemon.catch){
            return res.status(200).json(pokemon)
        }
        else{
            pokemon = await Pokemon.findOneAndReplace({"pokemon_id":pokemon_id},{
                pokemon_id: pokemon_id,
                view: true,
                catch: true,
            },{new:true})
            return res.status(200).json(pokemon)
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({error});  
    }
}
exports.inTeamByPokemonId = async (req,res)=>{
    try {
        const pokemon_id = req.params.pokemon_id;
        let pokemon = await Pokemon.findOne({"pokemon_id":pokemon_id})
        if(!pokemon){
            return res.status(404).json({message:"Pokemon not view yet"})
        } else if(!pokemon.catch){
            return res.status(400).json({message:"Bad request, pokemon not catch yet"})
        }else{
            pokemon = await Pokemon.findOneAndReplace({"pokemon_id":pokemon_id},{
                pokemon_id: pokemon_id,
                view: true,
                catch: true,
                in_team:!pokemon.in_team
            },{new:true}
            )
            return res.status(200).json(pokemon)
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({error});     
    }
}