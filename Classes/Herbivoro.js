import {Organismo} from "./Organismo.js";

export class Herbivoro extends Organismo{
    static n_herbivoros = 0;
    constructor(x, y, raio, vel, acel, vel_max, forca_max, cor, raio_deteccao, energia, energia_max, taxa_gasto_energia, cansaco_max, taxa_aum_cansaco){
        super(x, y, raio, vel, acel, vel_max, forca_max, cor, raio_deteccao, energia, energia_max, taxa_gasto_energia, cansaco_max, taxa_aum_cansaco);
       //alguma coisa que quer que aconteça logo na criação
       Herbivoro.n_herbivoros++;
     }

     reproduzir(){
        var dados_filho = this._reproduzir();
        //pegando as variáveis do método privado e repassando para o público;
        var raio_filho = dados_filho[0];
        var vel_max_filho = dados_filho[1];
        var forca_max_filho = dados_filho[2];
        var raio_deteccao_filho = dados_filho[3];
        var energia_max_filho = dados_filho[4];
        var taxa_gasto_energia_filho = dados_filho[5];
        var cansaco_max_filho = dados_filho[6];
        var taxa_aum_cansaco_filho = dados_filho [7];

        return new Herbivoro(
            this._posicao.x, this._posicao.y, raio_filho, this._vel, this._acel, vel_max_filho, forca_max_filho, 
            this._cor, raio_deteccao_filho, this._energia, energia_max_filho, taxa_gasto_energia_filho, 
            cansaco_max_filho, taxa_aum_cansaco_filho
            );
    }

    hello(){
        let tipo = "herbívoro";
        return this._hello(tipo);
    }
}