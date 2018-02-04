function vkApiInit(){
VK.init(function() { 
     // API initialization succeeded 
    readySet("API", false);
  }, function() { 
     // API initialization failed 
    readySet("API", true);
}, '5.68'); 
}

//����� ������ Vk Api
function apiMethods(methodName, methodParams, methodCallId, methodType){
  // ���������, ����������������� �� vkApi
  if(apiReady){ //��
    VK.api(methodName, methodParams, function (data) {
      data.callId = methodCallId;
      data.callType = methodType;
      sendToActionScript(data);
    });
  } else { //���
    //� ����� ������, ���������� ������, � ���, ��� Vk Api �� ���������������.
    var dataObj = {};
    dataObj.callId = methodCallId;
    dataObj.callType = methodType;
    dataObj.error = {error_code:1000, error_msg:"Vk API not init in JS."};
    sendToActionScript(dataObj);
  }
}

//����� Client API
function clientAPI(methodName, methodParams){
  // ���������, ����������������� �� vkApi
  if(apiReady){ //��
    // ��-�� ������������� apply, ����������, ����� ��� ��������� ���� ����� ������� ��������
    // methodParams - ��� ������. �� flash'�� �� ��� ���������� ��� ������.
    var argArray = methodParams; // ������� ��� ���� �� ������
    argArray.unshift(methodName); // � �������� � ���� ������ ��������
    // ��-�� ����, ��� �� ����, ������� ����� ����������, ��������� apply
    VK.callMethod.apply(null, argArray);
  } else { //�� ���������������
    // �� �� flash'e ���, � �� ������ ����, �������, ������� ������� callBack �� ������� �������.
    // ������� ������ ������� ��������� � �������
    console.log("Vk API not init");
  }
}


// � ������ ����������� ������� �������� � ��������� ��� ��������� �������. �.� ������ ��� ��� ����������� �� ����, � ���� ��������
// ����������� JS �� �������, ������ � ��� ������, ���� ��� ������ �� ����, � �������, ���� ��� ���� ���������. 
// � ����� ������, �� ������ ���������� ������������ ������ �����������, � ���������� ����������, - ��� ����� ��������.
// � ������� ��� ����� ���������, ��� JS ��������� �� ������� ��������� ���� ��� � �� �����, ��� �� ����� ����� ���� ��� ��������� �� ��� �������
var clientAPICallBackFunction = {}; //���������� ������ �� �������, ������� ������������ �������. (������� - ����) ������ ��� ����, ����� ����� �� �������

function clientAPICallBackControl(methodName, controlType){

console.log(methodName, controlType);

  if(controlType == "addEventListener"){ // ����� �������� ���������
  // ������� ������� ����� ��������� ����������, � ������ ���� ����������. ��� ������� �� ������.
  // ������� �� ���� ����� ����������� ������ ���������� arguments, ���� ���� �� ������
    VK.addCallback(methodName, callBackFunction);
    function callBackFunction() {
      var dataObj = {}; // ������, ������� ����� ������� �� flash
      dataObj.callType = "vkClientApiEvent"; // ������, ������ flash
      dataObj.methodName = methodName;
      dataObj.value = arguments;
      sendToActionScript(dataObj);
    };
    clientAPICallBackFunction[methodName] = callBackFunction; // ��������� ������ �� ��� �������
  } else if (controlType == "removeEventListener"){ //����� ������ ���������
    VK.removeCallback(methodName, clientAPICallBackFunction[methodName]);
  }
}