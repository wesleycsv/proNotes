const Notes = require("../Models/Notes");

class noteController {
  async create(request, response) {
    const { title, body } = request.body;
    try {
      let note = new Notes({
        title,
        body,
        author: request.userAuth.id,
      });
      await note.save();
      return response.status(201).json(note);
    } catch (error) {
      return response
        .status(500)
        .json({ Error: `Error personalizdo ${error}` });
    }
  }

  async listNotes(request, response) {
    try {
      let allNotes = await Notes.find({});

      return response.status(200).json(allNotes);
    } catch (error) {
      return response.status(500).json({ Error: "Error ao obter a lista" });
    }
  }
  
  async search(request, response) {
    const {query} = request.query
    try {
      let note = await Notes.find({author: request.userAuth.id}).find({$text: {$search: query}});

      return response.status(200).json(note);
    } catch (error) {
      return response.status(500).json({ Error: "Error ao obter a lista" });
    }
  }

  async oneNote(request, response) {
    const { id } = request.params;

    try {
      let oneNote = await Notes.findById(id);

      if (
        JSON.stringify(oneNote.author) === JSON.stringify(request.userAuth.id)
      ) {
        return response.status(200).json(oneNote);
      }

      return response.status(500).json({ Message: "Acesso negado a notas" });
    } catch (error) {
      return response.status(500).json({ Error: "Error ao obter a lista" });
    }
  }

  async update(request, response) {
    const { title, body } = request.body;
    const { id } = request.params;

    try {
      let noteId = await Notes.findById(id);

      if (
        JSON.stringify(request.userAuth.id) === JSON.stringify(noteId.author)
      ) {
        let noteUpdate = await Notes.findOneAndUpdate(
          { _id: id },
          { $set: { title: title, body: body } },
          { new: true, upsert: true }
        );
        return response.status(200).json(noteUpdate);
      } else {
        return response.status(401).json({ Error: " Acesso negado" });
      }
    } catch (error) {
      return response.status(200).json({ Error: "Error do servidor" });
    }
  }

  async delete(request, response) {
    const { id } = request.params;
    let noteId = await Notes.findById(id);
    if (JSON.stringify(request.userAuth.id) === JSON.stringify(noteId.author)) {
      await noteId.deleteOne();

      return response
        .status(204)
        .json({ message: "Nota deletada com sucesso" });
    } else {
      return response.status(401).json({ Error: " Acesso negado" });
    }
  }
}

module.exports = new noteController();
