export enum Message {
  FileNotSupported = "Le fichier n'est pas supporté. Veuillez sélectionner un fichier PDF, CSV ou XLSX.",
  FileTooLarge = 'Le fichier est trop grand',
  FileEncrypted = 'Le fichier est crypté',
  Cancel_Number = 'Souhaitez-vous annuler le numéro ',
  Delete_Grid = 'Souhaitez-vous supprimer la grille N° ',
  Delete_Multiple_Grids = 'Souhaitez-vous supprimer ces grilles ?',
  Demarquer = 'Souhaitez-vous démarquer ? Cela va réinitialiser le tirage et démarquer tous vos cartons.',
  Move_Multiple_Grids = 'Souhaitez-vous déplacer ces grilles dans une autre catégorie ?',
  Delete_Category = `Souhaitez-vous supprimer cette catégorie ?`,
  Delete_Category_Detail = `Si des cartons sont présents dans cette catégorie, ils seront déplacés dans la catégorie 'Autre'`,
  Import_Which_Category = 'Dans quelle catégorie souhaitez-vous importer ces cartons ?',
  Import_Info = `Pour l'instant, seuls les imports BaskoLoto sont opérationnels`,
  Import_Error = `Une erreur est survenue lors de l'analyse de l'image. Aucune des grilles n'a été trouvée.`,
  Error = `Une erreur est survenue.`,
  Delete_All_Datas = 'Souhaitez-vous réinitialiser toutes les données (cartons et catégories) ?',
  Quit_Tirage_Page = 'Le tirage en cours sera arrêté si vou changez de page. Continuez ? ',
  End_Tirage = 'Souhaitez-vous bien terminer cette partie ?',
  Info_Import = 'Les types de loto pris en compte sont : Basko Loto et les formats de fichier acceptés sont pdf et csv.',
}
