var file = null

$('#input').change(function () {
    if (this.files && this.files[0]) {
        $('#input_label').text(this.files[0].name)
        var reader = new FileReader()
        reader.readAsDataURL(this.files[0])
        reader.onload = function (e) {
            $('#cover').attr('src', reader.result)
        }
        file = this.files[0]
    }
});

$('#submit').click(function (e) {
    if (file) {
        // disable button
        $(this).prop('disabled', true);
        // add spinner to button
        $(this).html(
            '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 預測中'
        );

        const formData = new FormData()
        formData.append('uploadFile', file)
        axios.post(
            'https://my-nodejs-web-245517.appspot.com/api/automl',
            formData
        ).then(response => {
            // show result
            $('#class_name').text(response.data.class_name)
            $('#class_score').text(response.data.class_score)

            // disable button
            $(this).prop('disabled', false);
            // reset the button
            $(this).html(
                '偵測'
            );
        })
    }
    else {
        console.log('請選擇圖片')
    }
});