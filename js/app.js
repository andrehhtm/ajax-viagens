$(function() {
    $(".btn-listar").on("click", function() {
        let model = $(this).data("model");
        listarServidor(model);
    })
    $("#form-insert").submit(function( event ) {
        var inputs = {};
        let model = $(this).data("model");
        $(this).find("input").each(function(index){
            if($(this).attr("type") === "checkbox") {
                console.log("checks")
                if($(this).is(':checked')) {
                    inputs[$(this).attr("name")] = true;
                }
                else {
                    inputs[$(this).attr("name")] = false;
                }
            }else {
                inputs[$(this).attr("name")] = $(this).val()
            }
        })
        console.log(model)
        console.log(inputs);
        salvarServidor(model, inputs)
        event.preventDefault();
    })

    $("#form-edit").submit(function( event ) {
        var inputs = {};
        let model = $(this).data("model");
        $(this).find("input").each(function(index){
            if($(this).attr("type") == "checkbox") {
                if($(this).is(':checked')) {
                    inputs[$(this).attr("name")] = true;
                }
                else {
                    inputs[$(this).attr("name")] = false;
                }
            }else {
                inputs[$(this).attr("name")] = $(this).val()
            }
        })
        console.log(model)
        console.log(inputs);
        salvarServidor(model, inputs)
        event.preventDefault();
    })

    $("#editModal").on('show.bs.modal', function (e) {
        var inputs = {};
        var model = $(e.relatedTarget).data("model")
        var id = $(e.relatedTarget).data("registro")
        
        console.log($(this))
        buscarServidorToModal(model, id, $(this));
    })

    $(".button-edit").on('click', function() {
        $("#form-edit").submit();
    })

    $(".button-save").on('click', function() {
        $("#form-insert").submit();
    })
})

function listarServidor(model) {
    var settings = {
        "url": "http://104.236.122.55:80/doctum/pw/tp1/route.php",
        "method": "GET",
        "error": function( data ) {
            console.log("ERROR");
            console.log(data);
        },
        "success": function( data ) {
            console.log("SUCCESS");
            inserir_dados_tabela(JSON.parse(data), model);
            $(".btn-delete").on("click", function() {
                deletarServidor(model, $(this).data('registro'));
            })
        },
        "headers": {
            "table": model,
            "Content-Type": "application/json"
        },
    }
    $.ajax(settings);
}

function buscarServidorToModal(model, id, modal) {
    var settings = {
        "url": "http://104.236.122.55:80/doctum/pw/tp1/route.php?id="+id,
        "method": "GET",
        "error": function( data ) {
            console.log("ERROR");
            console.log(data);
        },
        "success": function( data ) {
            console.log("SUCCESS");
            let _formulario = $(modal).find("form")  
            let registro = JSON.parse(data)[0]   
            console.log(registro)

            for (let [key, value] of Object.entries(registro)) {
                _formulario.find("[name='"+key+"']").val(value)
            }
            
        },
        "headers": {
            "table": model,
            "Content-Type": "application/json"
        },
    }
    $.ajax(settings);
}

function deletarServidor(model, id) {
    var settings = {
        "url": "http://104.236.122.55:80/doctum/pw/tp1/route.php?id="+id,
        "method": "DELETE",
        "error": function( data ) {
            console.log("ERROR");
            console.log(data);
        },
        "success": function( data ) {
            console.log("SUCCESS");
            console.log(data)
            deletarLinha("linha-"+id)
        },
        "headers": {
            "table": model,
            "Content-Type": "application/json"
        },
    }
    $.ajax(settings);
}

function deletarLinha(linha) {
    document.getElementById(linha).remove();
}

function salvarServidor(model, registro) {
    var settings = {
        "url": "http://104.236.122.55:80/doctum/pw/tp1/route.php",
        "method": "POST",
        "data" : JSON.stringify(registro),
        "error": function( data ) {
            console.log("ERROR");
            console.log(data);
        },
        "success": function( data ) {
            console.log("SUCCESS");
            console.log(data);
            // inserir_dados_tabela(JSON.parse(data));
        },
        "headers": {
            "table": model,
            "Content-Type": "application/json"
        },
    }
    $.ajax(settings);
}
function inserirFuncionario(funcionario) {
    var settings = {
        "url": "http://104.236.122.55:80/doctum/pw/tp1/route.php",
        "method": "POST",
        "data" : JSON.stringify(funcionario),
        "error": function( data ) {
            console.log("ERROR");
            console.log(data);
        },
        "success": function( data ) {
            console.log("SUCCESS");
            console.log(data);
            // inserir_dados_tabela(JSON.parse(data));
        },
        "headers": {
            "table": "funcionario",
            "Content-Type": "application/json"
        },
    }
    $.ajax(settings);
}

function inserir_dados_tabela(registros, model){
	var tabela = document.getElementById("tabela-listagem");
	tabela.innerHTML = "";
	console.log(registros);
	for (var i = 0; i < registros.length; i++) {
        console.log(registros[i])
        var linha = document.createElement("tr");
        linha.setAttribute("id", "linha-"+registros[i].id)
        let colunas = [];
        for (let [key, value] of Object.entries(registros[i])) {
            colunas.push(value)
        }

        for(let i = 0; i < colunas.length; i++) {
            let element = document.createElement("td")
            let aux = "";
            if(typeof colunas[i] === "object" && colunas[i] != null) {
                for(let j = 0; j < colunas[i].length; j++) {
                    console.log(colunas[i][j])
                    let content = document.createTextNode(colunas[i][j].funcionario__nome)
                    element.appendChild(content)
                }
            }else {
                let content = document.createTextNode(colunas[i])
                element.appendChild(content)
            }
            linha.appendChild(element)
        }

        let buttonDelete = document.createElement("button")
        buttonDelete.setAttribute("data-registro", registros[i].id)
        buttonDelete.setAttribute("data-model", model)
        buttonDelete.setAttribute("class", "btn btn-danger btn-delete")
        buttonDelete.appendChild(document.createTextNode("Deletar"))

        let buttonEdit = document.createElement("button")
        buttonEdit.setAttribute("data-registro", registros[i].id)
        buttonEdit.setAttribute("data-toggle","modal")
        buttonEdit.setAttribute("data-target", "#editModal")
        buttonEdit.setAttribute("data-model", model)
        buttonEdit.setAttribute("class", "btn btn-warning btn-edit")
        buttonEdit.appendChild(document.createTextNode("Editar"))

        let element = document.createElement("td")
        element.appendChild(buttonEdit);
        element.appendChild(buttonDelete);
        linha.appendChild(element)

		tabela.appendChild(linha);
	}
}
