class Organismo{
    static organismos = [];
    static n_total_organismos = 0;
    static id = 0;

    constructor(x, y, raio_min, vel_max, forca_max, cor, raio_deteccao_min, eficiencia_energetica, energia_max, cansaco_max, taxa_aum_cansaco, tempo_vida_min, tempo_vida_max){
        this.posicao = new Vetor(x, y);
        this.raio_min = raio_min;
        this.raio = this.raio_min;
        this.vel = new Vetor(0.0001, 0.0001);
        this.acel = new Vetor(0, 0);
        this.vel_max = vel_max;
        this.forca_max = forca_max;
        this.cor = cor;
        var rgb = cor.substring(4, cor.length - 1).split(",");
        this.cor2 = "rgba(" + Math.floor(parseInt(rgb[0]) * 0.4) + "," + Math.floor(parseInt(rgb[1]) * 0.4) + "," + Math.floor(parseInt(rgb[2]) * 0.4) + ")";
        this.raio_deteccao_min = raio_deteccao_min;
        this.raio_deteccao = raio_deteccao_min;
        this.eficiencia_energetica = eficiencia_energetica;
        this.energia_max = energia_max;
        this.energia = this.energia_max * 0.5; // Começa com uma parcela da energia máxima
        this.taxa_gasto_energia;
        this.taxa_gasto_energia_max = ((Math.pow(this.raio_min, 2) * Math.pow(this.vel_max, 2)) / 2500).toFixed(4) * eficiencia_energetica; // Usado como valor para o cálculo da média da população
        this.gasto_minimo = parseFloat((this.taxa_gasto_energia_max / 10).toFixed(4)); // Gasto de energia mínimo (que independe da velocidade)
        this.cansaco_max = cansaco_max;
        this.taxa_aum_cansaco = taxa_aum_cansaco;
        this.chance_de_reproducao = 0.5;
        this.tempo_vivido = 0;
        this.status;
        // setInterval(this.updateTempoVivido, 1000);
        // setInterval(console.log("teste"), 1000);

        // Tempo de vida
        this.segundo_nascimento = segundo; // "segundo" é a variável global
        this.tempo_vida = {};
        this.tempo_vida.min = tempo_vida_min; // em ssegundos
        this.tempo_vida.max = tempo_vida_max;
        this.tempo_vida.real = parseInt(geraNumeroPorIntervalo(tempo_vida_min, tempo_vida_max)); // tempo de vida do organismo
        // let cronometro_morte = setTimeout(() => {this.morre()}, this.tempo_vida.real); // variável que guarda a função de matar o indivíduo depois do tempo de vida real

        // Variáveis de status
        this.comendo = false;
        this.fugindo = false;
        this.vagueando = false;
        // this.perto_da_borda;

        // Variável que delimita a distância da borda a partir da qual os organismos começarão a fazer a curva para não bater nas bordas 
        this.d = 20; 

        // variáveis usadas para o método vagueia()
        this.d_circulo = 2;
        this.raio_circulo = 1;
        this.angulo_vagueio = Math.random() * 360;

        // variável para separar os organismos que nasceram antes da divisão da tela dos que nasceram depois
        this.antes_da_divisao = false;
        this.posicao_fixa_momentanea = new Vetor(x, y);

        // ID 
        this.id = Organismo.id++;

        Organismo.organismos.push(this);
        Organismo.n_total_organismos++;
    }
  
    // Criando um método de reprodução comum a todos os organismos
    _reproduzir(){

        // raio mínimo
        var raio_min_filho = newMutacao(this.raio_min);
        if(raio_min_filho < 0){
            raio_min_filho = 0;
        }
        // velocidade máxima
        var vel_max_filho = newMutacao(this.vel_max);
        if(vel_max_filho < 0){
            vel_max_filho = 0;
        }

        // força máxima
        var forca_max_filho = newMutacao(this.forca_max);

        // cor
        var cor_filho = corMutacao(this.cor);

        // raio de detecção
        var raio_deteccao_min_filho = newMutacao(this.raio_deteccao_min);
        if(raio_deteccao_min_filho < 5){
            raio_deteccao_min_filho = 5;
        }

        // eficiência energética
        var eficiencia_energetica_filho = newMutacao(this.eficiencia_energetica);

        // energia máxima
        var energia_max_filho = newMutacao(this.energia_max);

        // cansaço máximo
        var cansaco_max_filho = newMutacao(this.cansaco_max);

        // taxa de aumento do cansaço
        var taxa_aum_cansaco_filho = newMutacao(this.taxa_aum_cansaco);
        
        // // tempo de vida mínimo
        // var tempo_vida_min_filho = newMutacao(this.tempo_vida.min);
    
        // //tempo de vida máximo
        // var tempo_vida_max_filho = newMutacao(this.tempo_vida.max);

        var dados_filho = {raio_min: raio_min_filho, vel_max: vel_max_filho, forca_max: forca_max_filho, cor: cor_filho,
        raio_deteccao_min: raio_deteccao_min_filho, eficiencia_energetica: eficiencia_energetica_filho, energia_max: energia_max_filho, 
        cansaco_max: cansaco_max_filho, taxa_aum_cansaco: taxa_aum_cansaco_filho, tempo_vida_min: this.tempo_vida.min, 
        tempo_vida_max: this.tempo_vida.max};

        return dados_filho;
    }

    // Método para atualizar o estado do organismo
    update(){
        this.taxa_gasto_energia = (Math.pow(this.raio, 2) * Math.pow(this.vel.mag(), 2)) / 2000; // Atualiza de acordo com a velocidade atual
        // this.tempo_vivido++;
        // Taxa de diminuição de energia
        if(this.energia > 0){
            this.energia -= (this.taxa_gasto_energia + this.gasto_minimo);
            // console.log(this.energia);
            // console.log(this.gasto_minimo);
            // if(this.energia > this.energia_max * 0.7){ // Se estiver com mais que 70% de energia, pode se reproduzir
            //     if(Math.random() < 0.0014){ // Número baixo pois testa a cada frame
            //         if(Math.random() <= this.chance_de_reproducao){
            //             this.reproduzir();
            //         }
            //     } 
            // }
        } else{
            this.morre(); 
        }
        
        if(segundo - this.segundo_nascimento >= this.tempo_vida.real){ // se se passar mais tempo desde o nascimento que o tempo de vida do organismo
            this.morre();
        }

        if(telaDividida){
            this.criaBordas(true);
        } else{
            this.criaBordas(false);
        }
        
        // this.delimitaBordas(this.posicao.x); // Limita posição pela borda do canvas caso o bicho não consiga desacelerar o suficiente

        // this.evitaBordas(this.posicao.x); // Faz com que o organismo verifique se está próximo às bordas a cada frame

    
        // Atualização da velocidade (soma vetor velocidade com o vetor aceleração)
        this.vel.add(this.acel);
        // Limita velocidade
        this.vel.limit(this.vel_max);

        // console.log("ângulo vel: ", this.vel.headingDegs());

        // Se existir um proxy, inserir por lá para que seja possível monitorar a mudança de posicao
        if(this.proxy) {
            this.proxy.add(this.vel)
        } else {
            // A velocidade altera a posição (assim como a aceleração altera a velocidade)
            this.posicao.add(this.vel);
        }
        // Reseta a aceleração para 0 a cada ciclo
        this.acel.mul(0);

        this.display();
    }

    // Método para criar bordas que delimitarão o espaço do organismo
    criaBordas(telaDividida){ // telaDividida: boolean
        this.delimitaBordas(telaDividida);
        this.evitaBordas(telaDividida);
    }

    // Método para impedir a passagem dos organismos para fora da tela
    delimitaBordas(telaDividida){
        if(telaDividida == true){
            // Delimitação para quem ficou no lado esquerdo
            if(this.posicao.x <= canvas.width/2){
                if(this.posicao.x + 2*this.raio > canvas.width / 2) // borda direita (a divisão, ou seja, na metade da tela)
                    this.vel.x = this.vel.x * -1; // inverte a velocidade x se ultrapassa a borda

                if(this.posicao.x < 0) // borda esquerda
                    this.vel.x = this.vel.x * -1;

                if(this.posicao.y + this.raio > canvas.height) // borda baixo
                    this.vel.y = this.vel.y* -1;

                if(this.posicao.y < 0) // borda cima
                    this.vel.y = this.vel.y * -1;
            } else{ // Delimitação para quem ficou no lado direito
                if(this.posicao.x + 2*this.raio > canvas.width) // borda direita
                    this.vel.x = this.vel.x * -1; //inverte a velocidade x se ultrapassa a borda do canvas

                if(this.posicao.x - this.raio < canvas.width / 2) // borda esquerda (a divisão, ou seja, na metade da tela)
                    this.vel.x = this.vel.x * -1;

                if(this.posicao.y + this.raio > canvas.height) // borda baixo
                    this.vel.y = this.vel.y* -1;

                if(this.posicao.y < 0) // borda cima
                    this.vel.y = this.vel.y * -1;
            }
            
        } else{ // se a tela NÃO estiver dividida
            if(this.posicao.x + 2*this.raio > canvas.width) // borda direita
                this.vel.x = this.vel.x * -1; //inverte a velocidade x se ultrapassa a borda do canvas

            if(this.posicao.x - this.raio < 0) // borda esquerda
                this.vel.x = this.vel.x * -1;

            if(this.posicao.y + this.raio > canvas.height) // borda baixo
                this.vel.y = this.vel.y* -1;

            if(this.posicao.y < 0) // borda cima
                this.vel.y = this.vel.y * -1;
        }
        
    }

    // Método para aplicar força ao organismo que o impeça de continuar a seguir por uma trajetória para fora da tela
    evitaBordas(telaDividida){
        var vel_desejada = null; // Esta velocidade será o vetor que dirá para onde o organismo deve ir para não sair da borda
        this.perto_da_borda = false;

        if(telaDividida == true){
            // Para quem ficou na parte esquerda
            if(this.posicao.x <= canvas.width/2){
                // Borda esquerda
                if(this.posicao.x - this.raio < this.d){ // d é um atributo de todo organismo que delimita a distância de uma borda a partir da qual ele começará a manobrar
                    vel_desejada = new Vetor(this.vel_max, this.vel.y); // Faz sua velocidade ser máxima na direção x (para a direita)
                    this.perto_da_borda = true;
                } 
                // Borda direita
                else if(this.posicao.x + 2*this.raio > canvas.width / 2 - this.d){ // a borda direita é a metade do canvas (na tela dividida)
                    vel_desejada = new Vetor(-this.vel_max, this.vel.y); // Faz sua velocidade ser máxima na direção -x (para a esquerda)
                    this.perto_da_borda = true;
                }
                // Borda de cima
                if(this.posicao.y - this.raio < this.d){
                    vel_desejada = new Vetor(this.vel.x, this.vel_max); // Faz sua velocidade ser máxima na direção y (para a baixo)
                    this.perto_da_borda = true;
                }
                // Borda de baixo
                else if(this.posicao.y + this.raio > canvas.height - this.d){
                    vel_desejada = new Vetor(this.vel.x, -this.vel_max); // Faz sua velocidade ser máxima na direção -y (para a cima)
                    this.perto_da_borda = true;
                }
            }

            // Para quem ficou na parte direita
            else{
                // Borda esquerda
                if(this.posicao.x - this.raio < canvas.width/2 + this.d){ // a borda esquerda é a metade do canvas (na tela dividida)
                    vel_desejada = new Vetor(this.vel_max, this.vel.y); // Faz sua velocidade ser máxima na direção x (para a direita)
                    this.perto_da_borda = true;
                } 
                // Borda direita
                else if(this.posicao.x + 2*this.raio > canvas.width - this.d){
                    vel_desejada = new Vetor(-this.vel_max, this.vel.y); // Faz sua velocidade ser máxima na direção -x (para a esquerda)
                    this.perto_da_borda = true;
                }
                // Borda de cima
                if(this.posicao.y < this.d){
                    vel_desejada = new Vetor(this.vel.x, this.vel_max); // Faz sua velocidade ser máxima na direção y (para a baixo)
                    this.perto_da_borda = true;
                }
                // Borda de baixo
                else if(this.posicao.y > canvas.height - this.d){
                    vel_desejada = new Vetor(this.vel.x, -this.vel_max); // Faz sua velocidade ser máxima na direção -y (para a cima)
                    this.perto_da_borda = true;
                }
            }
            
        } else{ // se a tela NÃO estiver dividida
             // Borda esquerda
             if(this.posicao.x - this.raio < this.d){ 
                vel_desejada = new Vetor(this.vel_max, this.vel.y); // Faz sua velocidade ser máxima na direção x (para a direita)
                this.perto_da_borda = true;
            } 
            // Borda direita
            else if(this.posicao.x + this.raio > canvas.width - this.d){
                vel_desejada = new Vetor(-this.vel_max, this.vel.y); // Faz sua velocidade ser máxima na direção -x (para a esquerda)
                this.perto_da_borda = true;
            }
            // Borda de cima
            if(this.posicao.y - this.raio < this.d){
                vel_desejada = new Vetor(this.vel.x, this.vel_max); // Faz sua velocidade ser máxima na direção y (para a baixo)
                this.perto_da_borda = true;
            }
            // Borda de baixo
            else if(this.posicao.y + this.raio> canvas.height - this.d){
                vel_desejada = new Vetor(this.vel.x, -this.vel_max); // Faz sua velocidade ser máxima na direção -y (para a cima)
                this.perto_da_borda = true;
            }
        }
        

        if(vel_desejada != null){ // Caso qualquer uma das condições anteriores tenha sido satisfeita
            vel_desejada.normalize(); // Normaliza (transforma para ter tamanho 1) o vetor vel_desejada
            vel_desejada.mul(this.vel_max); // Multiplica o vetor (que agora tem tamanho 1) pela velocidade máxima
            var redirecionamento = vel_desejada.sub(this.vel); // Cria um vetor de força que redirecionará o organismo
            redirecionamento.limit(this.forca_max * 100); // Limita essa força com uma folga maior para dar chances dela ser maior que as outras forças atuantes nele
            this.aplicaForca(redirecionamento); // Aplica esta força no organismo e a deixa levemente mais forte para ganhar prioridade em relação a outras forças
        }
    }


    // Método para aplicar a força que fará o organismo virar na direção do alvo mais próximo de modo natural
    aplicaForca(forca){
        // Adiciona a força à aceleração, o que a faz aumentar
        // Podemos considerar a massa no cálculo também: A = F / M (não implementado)
        this.acel.add(forca);
    }

    // Teste para implementação de aprendizado de comportamento
    comportamento(bom, ruim){
        
    }

    // Método que fará o organismo vaguear por aí quando não está fugindo ou perseguindo
    vagueia(){
        // if(!this.fugindo && !this.comendo){
            this.vagueando = true;
            this.status = "vagueando";
            // A ideia é criar uma pequena força a cada frame logo à frente do organismo, a uma d dele.
            // Desenharemos um círculo à frente do organismo, e o vetor da força de deslocamento partirá do centro
            // do círculo e terá o tamanho de seu raio. Assim, quanto maior o círculo, maior a força.
            // A fim de sabermos qual é a frente do organismo, utilizaremos o vetor velocidade para nos auxiliar, 
            // já que ele está sempre apontando na direção do movimento do organismo.

            // CRIANDO O CÍRCULO
            var centro_circulo = new Vetor(0, 0); // Criamos um vetor que representará a distância do organismo ao centro do círculo
            centro_circulo = this.vel.copy(); // Isso é para que o círculo esteja exatamente à frente do organismo (como explicado um pouco acima)
            centro_circulo.normalize(); // Normalizamos o vetor, ou seja, seu tamanho agora é 1 (e não mais o tamanho do vetor velocidade, como era na linha acima)
            centro_circulo.mul(this.d_circulo); // A variável d_circulo é uma constante definida globalmente, e guarda o valor da distância do centro do círculo
            
            // CRIANDO A FORÇA DE DESLOCAMENTO
            var deslocamento = new Vetor(0, -1);
            deslocamento.mul(this.raio_circulo); // A força terá o tamanho do raio do círculo
            // Mudando a direção da força randomicamente
            deslocamento.rotateDegs(this.angulo_vagueio); // Rotaciona a força em angulo_vagueio (variável definida no construtor)
            // Mudando ligeiramente o valor de angulo_vagueio para que ele mude pouco a pouco a cada frame
            this.angulo_vagueio += Math.random() * 30 - 15; // Muda num valor entre -15 e 15
            
            // CRIANDO A FORÇA DE VAGUEIO
            // A força de vagueio pode ser pensada como um vetor que sai da posição do organismo e vai até um ponto
            // na circunferência do círculo que criamos
            // Agora que os vetores do centro do círculo e da força de deslocamento foram criados, basta somá-los
            // para criar a força de vagueio
            var forca_vagueio = new Vetor(0, 0);
            forca_vagueio = centro_circulo.add(deslocamento);
            
            // if(this.comendo || this.fugindo){ // Diminui a força de vagueio quando vai comer ou fugir para dar prioridade a estas tarefas
            //     forca_vagueio.mul(0.1);
            // }
            this.aplicaForca(forca_vagueio.mul(0.1));
        // }
    }

    // Método que calcula a força de redirecionamento em direção a um alvo
    // REDIRECIONAMENTO = VELOCIDADE DESEJADA - VELOCIDADE
    persegue(alvo){
        alvo.fugindo = true;
        // if(this instanceof Carnivoro){
        //     this.taxa_gasto_energia = (Math.pow(this.raio, 2) * Math.pow(this.vel.mag(), 2)) / 1200; // Aumenta o gasto de energia ao perseguir
        // }
        // O vetor da velocidade desejada é o vetor de posição do alvo menos o da própria posição
        var vel_desejada = alvo.posicao.subNew(this.posicao); // Um vetor apontando da localização dele para o alvo
        // Amplia a velocidade desejada para a velocidade máxima
        vel_desejada.setMag(this.vel_max);

        

        // Redirecionamento = velocidade desejada - velocidade
        var redirecionamento = vel_desejada.subNew(this.vel);
        redirecionamento.limit(this.forca_max); // Limita o redirecionamento para a força máxima

        // Soma a força de redirecionamento à aceleração
        this.aplicaForca(redirecionamento);
    }

    estaMorto(){
        return this.energia <= 0;
    }
    
    updateTempoVivido(){
        this.tempo_vivido++;
    }

    display(){
        c.beginPath();
        c.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI * 2);        
        c.fillStyle = this.cor2;
        c.strokeStyle = this.cor;
        c.lineWidth = 5;
        c.stroke();
        c.fill();
       
        
        // // desenhando o raio de detecção
        // c.beginPath();
        // c.arc(this.posicao.x, this.posicao.y, this.raio_deteccao, 0, Math.PI * 2);
        // c.strokeStyle = "grey";
        // c.stroke();
    }
    
    remove(lista) {
        var what, a = arguments, L = a.length, indice;
        while (L > 1 && lista.length) {
            what = a[--L];
            while ((indice = lista.indexOf(what)) !== -1) {
                lista.splice(indice, 1);
            }
        }
        return lista;
    }

    checaId(id){
        return (id == this.id);
    }
    
}