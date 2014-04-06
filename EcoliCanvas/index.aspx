<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="EcoliCanvas.index" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script defer="defer" src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js" type="text/javascript"></script>
    <script defer="defer" src="scripts/kinetic-v5.0.1.js" type="text/javascript"></script>
    <script defer="defer" src="scripts/CanvasScript.js" type="text/javascript"></script>
</head>
<body>
    <div class="containerBorder" style="border:dotted; border-width:1px;width:500px;height:500px">
        <div onkeydown="keydownevent" id="container">
        </div>
    </div>
</body>    

</html>
