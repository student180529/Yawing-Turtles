//---------------------------------------------------------------------------

#include <fmx.h>
#include <string.h>
#pragma hdrstop

#include "Main.h"
//---------------------------------------------------------------------------
#pragma package(smart_init)
#pragma resource "*.fmx"
TMainWindow *MainWindow;

	  struct Image{
   public:
   String ImageExtension;
   String LoadPath;
   String SavePath;
	  void ClearImage(){
		SavePath="";
		LoadPath="";
        ImageExtension="";
   }
	  void FindExtension(){
		int dot=LoadPath.Pos(".");
		int length=LoadPath.Length()+1;
        ImageExtension=LoadPath.SubString(dot,length-dot);
	  }
	  Image(){
		ClearImage();
   }
}Image1;

const String InfoAuthors="This program was written by: \n Agnieszka Klingiert \n Mateusz Po�om \n Mateusz Por�biak \n Pawe� Tumialis";
const String InfoProject="This program supports images in three extentions: .bmp, .jpg, .png";

//---------------------------------------------------------------------------
__fastcall TMainWindow::TMainWindow(TComponent* Owner)
	: TForm(Owner)
{
	OpenDialog1->Filter = "Bitmap (*.bmp)|*.BMP|Jpg (*.jpg)|*.JPG|Png (*.png)|*.PNG";
}
//---------------------------------------------------------------------------


void __fastcall TMainWindow::AuthorsClick(TObject *Sender)
{
	ShowMessage(InfoAuthors);
}
//---------------------------------------------------------------------------

void __fastcall TMainWindow::ProjectClick(TObject *Sender)
{
	ShowMessage(InfoProject);
}
//---------------------------------------------------------------------------

void __fastcall TMainWindow::RunClick(TObject *Sender)
{
	if(Image1.LoadPath==""){
		ShowMessage("You didn`t load an image!");
	}else if(Image1.SavePath==""){
		ShowMessage("You didn`t choose save location!");
	}else{
		ShowMessage("Algorithm");
		Image1.ClearImage();
		LoadBox->IsChecked=false;
		SaveBox->IsChecked=false;
	}

}
//---------------------------------------------------------------------------

void __fastcall TMainWindow::LoadClick(TObject *Sender)
{
	if(OpenDialog1->Execute()){
		if (FileExists(OpenDialog1->FileName)){
				Image1.LoadPath=OpenDialog1->FileName;
				//ShowMessage(Image1.LoadPath);
				Image1.FindExtension();
				//ShowMessage(Image1.ImageExtension);
				LoadBox->IsChecked=true;
		}
	}
}
//---------------------------------------------------------------------------

void __fastcall TMainWindow::SaveClick(TObject *Sender)
{
		 if(SaveDialog1->Execute()){
			Image1.SavePath=SaveDialog1->FileName;
			//ShowMessage(Image1.SavePath);
			SaveBox->IsChecked=true;
		 }
}

