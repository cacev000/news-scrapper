const getComments = (that) => {
    $(".notes").empty();
    var thisId = that;

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function (data) {
        $(`.notes[data-id="${data._id}"]`).append(`<h5>${data.title}</h5>`);
        $(`.notes[data-id="${data._id}"]`).append("<input class='inputTitle' placeholder='User Name' name='title' >");
        $(`.notes[data-id="${data._id}"]`).append("<textarea class='inputBody' placeholder='comments' name='body'></textarea>");
        $(`.notes[data-id="${data._id}"]`).append("<button data-id='" + data._id + "' class='savenote waves-effect waves-light btn-small grey lighten-2 '>Save Note</button>");

        $(`.comments`).empty();
        data.note.forEach(note => {
            $(`.comments[data-id="${data._id}"]`).append(
                `
                    <div id="comment${note._id}" class="comments card-content white-text">
                    <button data-id="${note._id}" id="delete${note._id}" class="waves-effect waves-light btn-small red accent-3 delete">X</button>
                        <strong>${note.title}</strong>
                        ${note.body}
                        <hr>
                    </div>
                `
            );
        });

        if (data.body) {
            $(".inputTitle").val(data.note.title);
            $(".inputBody").val(data.note.body);
        }
    });
}

$.getJSON("/articles", function (data) {
    // For each one
    $("#amountFound").append(`<h3>You found ${data.length} articles!<h3><h5> Click the title to add comment(s).</h5>`)
    for (var i = 0; i < data.length; i++) {
        $(".showCard").append(
            `
                <div class="row">
                    <div class="card blue-grey darken-1">
                        <div class="card-content white-text">
                            <span data-id="${data[i]._id}" class="newsTitle card-title">${data[i].title}</span>
                            <p class="newsBody">${data[i].subHead}</p>
                        </div>
                        <div class="card-action">
                            <a href="${data[i].link}" target="_blank" class="displayLink">Read More...</a>
                            <button data-id="${data[i]._id}" id="displayComments" class="waves-effect waves-light btn-small grey lighten-2">See Comments</button>
                        </div>
                        <div data-id="${data[i]._id}" class="notes"></div>
                        <div data-id="${data[i]._id}" class="comments"></div>
                    </div> 
                </div>
            `
        );
    }
});

$(document).on("click", "span", function () {
    let id = $(this).attr("data-id")
    getComments(id);
});

// show comments upon click
$(document).on("click", "#displayComments", function () {

    let id = $(this).attr("data-id");
    getComments(id);
});


// delete button comments
$(document).on("click", ".delete", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        type: "DELETE",
        url: "/delete/" + thisId,
        success: function (data) {

            $("#comment" + thisId).remove();
        },
        error: function (data) {
            console.log('Error:', data);
        }
    });

});


// save comments
$(document).on("click", ".savenote", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $(".inputTitle").val(),
            body: $(".inputBody").val()
        }
    }).then(function (data) {
        $(".notes").empty();

        $.ajax({
            method: "GET",
            url: "/comments/" + thisId,

        }).then(function (response) {
            $(`.comments`).empty();
            for (var i = 0; i < response.length; i++) {
                $(`.comments[data-id="${thisId}"]`).append(
                    `
                        <div id="comment${response.note[i]}" class="comments card-content white-text">
                        <button data-id="${response.note[i]}" id="delete${response.note[i]}" class="waves-effect waves-light btn-small red accent-3 delete">X</button>
                            ${response.note[i]}
                        </div>
                    `
                );
            }

        })
    });

    $(".inputTitle").val("");
    $(".inputBody").val("");
});