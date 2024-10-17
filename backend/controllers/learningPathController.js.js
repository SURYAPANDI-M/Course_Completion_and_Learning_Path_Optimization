const { PrismaClient } = require('@prisma/client'); // Import PrismaClient
const prisma = new PrismaClient(); // Create a new Prisma client instance

// Create a new learning path
// Create a new learning path
exports.createLearningPath = async (req, res) => {
    const { title, description, domain } = req.body;
    console.log(domain)
    try {
      // Validate input
      if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required.' });
      }

      //checking already title there

      const checkLearningPath = await prisma.learningPath.findFirst(
        {
            where:{title: title}
        }

      
      )
      if(checkLearningPath)
      {
        console.log(checkLearningPath)
        return res.status(409).json({message: 'Course already is present'})
      }
  
    //   Create a new learning path using Prisma
      const newLearningPath = await prisma.learningPath.create({
        data: {
          title,
          description,
          organizationDomain:domain
        },
      });
  
      return res.status(201).json(newLearningPath);
    } catch (error) {
      console.error('Error creating learning path:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
// Get all learning paths
exports.getLearningPaths = async (req, res) => {
    const {domain} = req.params
    try {
        const learningPaths = await prisma.learningPath.findMany({
            where:
            {
                organizationDomain: domain
            }
        }); // Fetch all learning paths

        return res.status(200).json(learningPaths);
    } catch (error) {
        console.error("Error fetching learning paths:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a learning path by ID
exports.getLearningPathById = async (req, res) => {
    const { id } = req.params; // Get ID from request parameters

    try {
        const learningPath = await prisma.learningPath.findUnique({
            where: { id: parseInt(id) }, // Ensure ID is an integer
        });

        if (!learningPath) {
            return res.status(404).json({ message: 'Learning path not found' });
        }

        return res.status(200).json(learningPath);
    } catch (error) {
        console.error("Error fetching learning path:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a learning path by ID
exports.updateLearningPath = async (req, res) => {
    const { id } = req.params; // Get ID from request parameters
    const { title, description } = req.body; // Extract fields from request body

    try {
        const updatedLearningPath = await prisma.learningPath.update({
            where: { id: parseInt(id) }, // Ensure ID is an integer
            data: {
                title,
                description,
            },
        });

        return res.status(200).json({ message: 'Learning path updated successfully', updatedLearningPath });
    } catch (error) {
        console.error("Error updating learning path:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a learning path by ID
exports.deleteLearningPath = async (req, res) => {
    const { id } = req.params; // Get ID from request parameters

    try {
        await prisma.learningPath.delete({
            where: { id: parseInt(id) }, // Ensure ID is an integer
        });

        return res.status(200).json({ message: 'Learning path deleted successfully' });
    } catch (error) {
        console.error("Error deleting learning path:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
